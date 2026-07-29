import Foundation
import FamilyControls
import ManagedSettings

/// The one piece of state the app, the monitor extension and the shield
/// extension all need to agree on.
///
/// `UserDefaults` in the App Group, not a database: the shield extension is
/// launched to render a block screen and must read the task name synchronously
/// under a tight memory budget. There is no history to store yet — GRDB arrives
/// with the sky, not with this.
public enum SessionStore {

    /// Must match `com.apple.security.application-groups` in every entitlements
    /// file in ios/project.yml. Change them together or the extensions will
    /// silently read an empty store.
    public static let appGroup = "group.com.focusflow.shared"

    /// Name of the ManagedSettings store the shield is applied to.
    public static let managedStoreName = ManagedSettingsStore.Name("focusflow.session")

    /// Identifier for the DeviceActivity schedule.
    public static let activityName = DeviceActivityName("focusflow.session")

    private enum Key {
        static let selection = "selection"
        static let taskName = "taskName"
        static let endsAt = "endsAt"
    }

    private static var defaults: UserDefaults? {
        UserDefaults(suiteName: appGroup)
    }

    // MARK: - Blocked app selection

    /// The user's chosen apps. Opaque tokens — we never learn which apps these
    /// are, which is why only the person can pick them (tech-stack constraint 3).
    public static var selection: FamilyActivitySelection {
        get {
            guard let data = defaults?.data(forKey: Key.selection),
                  let decoded = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
            else { return FamilyActivitySelection() }
            return decoded
        }
        set {
            guard let data = try? JSONEncoder().encode(newValue) else { return }
            defaults?.set(data, forKey: Key.selection)
        }
    }

    // MARK: - Current session

    /// The task the person named. This is what the shield displays, and the
    /// whole point of the POC: the block screen names the work you chose.
    public static var taskName: String {
        get { defaults?.string(forKey: Key.taskName) ?? "" }
        set { defaults?.set(newValue, forKey: Key.taskName) }
    }

    public static var endsAt: Date? {
        get { defaults?.object(forKey: Key.endsAt) as? Date }
        set { defaults?.set(newValue, forKey: Key.endsAt) }
    }

    public static var isRunning: Bool {
        guard let endsAt else { return false }
        return endsAt > Date()
    }

    public static func begin(task: String, endsAt: Date) {
        taskName = task
        self.endsAt = endsAt
    }

    public static func clear() {
        defaults?.removeObject(forKey: Key.taskName)
        defaults?.removeObject(forKey: Key.endsAt)
    }
}
