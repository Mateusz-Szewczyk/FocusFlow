import DeviceActivity
import Foundation

/// The guarantee.
///
/// The system launches this extension on the schedule the app registered, so
/// the unlock does not depend on FocusFlow being alive, foregrounded, or even
/// installed in memory. Step 6 of the POC verification — force-quit the app and
/// confirm the apps still unlock — is a test of this file and nothing else.
///
/// Runs under a very tight memory budget (single-digit MB). Keep it free of
/// heavy frameworks, image work, and networking.
class MonitorExtension: DeviceActivityMonitor {

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        guard activity == SessionStore.activityName else { return }

        // The app already applied the shield when the person tapped Start, so
        // this is belt-and-braces for a schedule that begins later than "now".
        ShieldController.apply(SessionStore.selection)
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        guard activity == SessionStore.activityName else { return }

        ShieldController.lift()
        SessionStore.clear()
    }
}
