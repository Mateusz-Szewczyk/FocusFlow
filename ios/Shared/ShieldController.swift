import Foundation
import FamilyControls
import ManagedSettings

/// Applies and lifts the shield.
///
/// Called from the app when a session starts, and from the monitor extension
/// when the window ends — so it lives in Shared and must not assume a UI.
public enum ShieldController {

    private static var store: ManagedSettingsStore {
        ManagedSettingsStore(named: SessionStore.managedStoreName)
    }

    /// Shield exactly the apps and categories the person picked.
    ///
    /// Everything not selected stays open — which is how "calls, messages,
    /// Maps, banking and 2FA stay open" is implemented: not as an allowlist we
    /// maintain, but as the natural consequence of shielding only what was
    /// chosen.
    public static func apply(_ selection: FamilyActivitySelection) {
        let apps = selection.applicationTokens
        let categories = selection.categoryTokens

        store.shield.applications = apps.isEmpty ? nil : apps
        store.shield.applicationCategories = categories.isEmpty
            ? nil
            : .specific(categories)
    }

    /// Lift everything. Safe to call when nothing is shielded.
    ///
    /// `clearAllSettings()` rather than assigning nil field by field: this is
    /// the unlock path, and it must not be able to half-succeed.
    public static func lift() {
        store.clearAllSettings()
    }
}
