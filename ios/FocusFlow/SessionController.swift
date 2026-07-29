import DeviceActivity
import FamilyControls
import Foundation
import Observation

/// Drives one session: authorize, hold the selection, start, stop.
@Observable
final class SessionController {

    enum AuthState: Equatable {
        case unknown
        case approved
        case denied(String)
    }

    var authState: AuthState = .unknown
    var selection = FamilyActivitySelection()
    var taskName = ""
    var minutes = 25
    var endsAt: Date?
    var lastError: String?

    private let center = DeviceActivityCenter()

    var isRunning: Bool {
        guard let endsAt else { return false }
        return endsAt > Date()
    }

    var hasSelection: Bool {
        !selection.applicationTokens.isEmpty || !selection.categoryTokens.isEmpty
    }

    var canStart: Bool {
        authState == .approved && hasSelection
            && !taskName.trimmingCharacters(in: .whitespaces).isEmpty && !isRunning
    }

    // MARK: - Lifecycle

    /// Restore whatever the extensions may have changed while we were not running.
    func refreshFromStore() {
        selection = SessionStore.selection
        taskName = SessionStore.taskName
        endsAt = SessionStore.isRunning ? SessionStore.endsAt : nil
    }

    /// `.individual` is the authorization a person grants for their own device —
    /// as opposed to a parent authorizing a child's. Requires iOS 16+, and fails
    /// on the Simulator, which is why this POC needs a physical iPhone.
    func requestAuthorization() async {
        do {
            try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
            authState = .approved
        } catch {
            authState = .denied(error.localizedDescription)
        }
    }

    func persistSelection() {
        SessionStore.selection = selection
    }

    // MARK: - The loop

    func start() {
        guard canStart else { return }
        lastError = nil

        let task = taskName.trimmingCharacters(in: .whitespaces)
        let end = Date().addingTimeInterval(TimeInterval(minutes) * 60)

        SessionStore.selection = selection
        SessionStore.begin(task: task, endsAt: end)

        // Shield now, so the block is immediate rather than waiting for the
        // system to launch the monitor extension.
        ShieldController.apply(selection)

        // The schedule is what lifts the shield. DeviceActivitySchedule works in
        // wall-clock components, not durations, so a session that would cross
        // midnight is clamped — acceptable for a POC that runs minutes.
        let cal = Calendar.current
        let schedule = DeviceActivitySchedule(
            intervalStart: cal.dateComponents([.hour, .minute], from: Date()),
            intervalEnd: cal.dateComponents([.hour, .minute], from: end),
            repeats: false
        )

        do {
            center.stopMonitoring([SessionStore.activityName])
            try center.startMonitoring(SessionStore.activityName, during: schedule)
            endsAt = end
        } catch {
            // Monitoring failed, so nothing would ever lift the shield. Undo.
            ShieldController.lift()
            SessionStore.clear()
            endsAt = nil
            lastError = "Could not schedule the session: \(error.localizedDescription)"
        }
    }

    /// The POC's manual stop. The real product puts a wait in front of this —
    /// out of scope here, and deliberately so.
    func stop() {
        center.stopMonitoring([SessionStore.activityName])
        ShieldController.lift()
        SessionStore.clear()
        endsAt = nil
    }
}
