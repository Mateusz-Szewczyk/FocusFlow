import ManagedSettings
import ManagedSettingsUI
import UIKit

/// The block screen.
///
/// This is a fixed system template — background, icon, title, subtitle and up
/// to two buttons. Arbitrary SwiftUI cannot be rendered here, so the Star Forge
/// star does not appear on the one screen people will see most
/// (docs/tech-stack.md, constraint 2). What it *can* do is the thing the product
/// is built on: name the work the person chose.
///
/// Colours are hardcoded rather than read from DesignTokens because
/// ShieldConfiguration wants UIColor and the generated tokens are SwiftUI
/// Color. Values are the night palette from tokens/colors.css — if those
/// change, change these.
class ShieldConfigurationExtension: ShieldConfigurationDataSource {

    private enum Night {
        /// --sf-night #0B0E20
        static let background = UIColor(red: 0.043, green: 0.055, blue: 0.125, alpha: 1)
        /// --sf-ink #EEF1FF
        static let ink = UIColor(red: 0.933, green: 0.945, blue: 1.000, alpha: 1)
        /// --sf-ink-2 #A7AFD8
        static let ink2 = UIColor(red: 0.655, green: 0.686, blue: 0.847, alpha: 1)
        /// --accent-base #8C9BE8
        static let accent = UIColor(red: 0.549, green: 0.608, blue: 0.910, alpha: 1)
    }

    private func configuration() -> ShieldConfiguration {
        let task = SessionStore.taskName

        // Voice rules from readme.md: calm, adult, never shaming. No streak
        // language, no exclamation mark, no emoji. Headlines end in a full stop.
        let title = task.isEmpty ? "This is protected time." : "Still forging."
        let subtitle = task.isEmpty
            ? "Your session is running."
            : task

        return ShieldConfiguration(
            backgroundBlurStyle: .systemUltraThinMaterialDark,
            backgroundColor: Night.background,
            icon: nil,
            title: ShieldConfiguration.Label(text: title, color: Night.ink),
            subtitle: ShieldConfiguration.Label(text: subtitle, color: Night.ink2),
            primaryButtonLabel: ShieldConfiguration.Label(text: "Close", color: Night.background),
            primaryButtonBackgroundColor: Night.accent,
            secondaryButtonLabel: nil
        )
    }

    override func configuration(shielding application: Application) -> ShieldConfiguration {
        configuration()
    }

    override func configuration(shielding application: Application,
                                in category: ActivityCategory) -> ShieldConfiguration {
        configuration()
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        configuration()
    }

    override func configuration(shielding webDomain: WebDomain,
                                in category: ActivityCategory) -> ShieldConfiguration {
        configuration()
    }
}
