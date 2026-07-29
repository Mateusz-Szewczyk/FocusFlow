import Combine
import FamilyControls
import SwiftUI

/// Deliberately plain. This POC proves the blocking loop, not the visual system —
/// no star, no Canvas, no Live Activity. It uses the generated night tokens only
/// so the thing does not look like a different product while we test it.
struct RootView: View {
    @Bindable var controller: SessionController
    @State private var pickerShown = false

    private let tick = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    @State private var now = Date()

    var body: some View {
        ZStack {
            DesignTokens.Colors.paper.ignoresSafeArea()

            VStack(alignment: .leading, spacing: DesignTokens.Spacing.space6) {
                header

                switch controller.authState {
                case .unknown:
                    ProgressView().tint(DesignTokens.Colors.accentBase)
                case .denied(let message):
                    denied(message)
                case .approved:
                    if controller.isRunning { running } else { setup }
                }

                Spacer()

                if let error = controller.lastError {
                    Text(error)
                        .font(.footnote)
                        .foregroundStyle(DesignTokens.Colors.amber)
                }
            }
            .padding(DesignTokens.Spacing.screenGutter)
        }
        .onReceive(tick) { now = $0 }
        .familyActivityPicker(isPresented: $pickerShown, selection: $controller.selection)
        .onChange(of: controller.selection) { _, _ in controller.persistSelection() }
    }

    // MARK: - Pieces

    private var header: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.space2) {
            Text("FOCUSFLOW · POC")
                .font(.system(size: DesignTokens.FontSize.label, design: .monospaced))
                .tracking(2.4)
                .foregroundStyle(DesignTokens.Colors.ink3)
            Text("Protected time.")
                .font(.system(size: DesignTokens.FontSize.displayL, design: .serif))
                .foregroundStyle(DesignTokens.Colors.ink1)
        }
        .padding(.top, DesignTokens.Spacing.space8)
    }

    private func denied(_ message: String) -> some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.space3) {
            Text("Screen Time access was not granted.")
                .foregroundStyle(DesignTokens.Colors.ink1)
            Text(message)
                .font(.footnote)
                .foregroundStyle(DesignTokens.Colors.ink2)
            Button("Ask again") {
                Task { await controller.requestAuthorization() }
            }
            .tint(DesignTokens.Colors.accentBase)
        }
    }

    private var setup: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.space5) {

            field("What are you working on?") {
                TextField("Writing the finance report", text: $controller.taskName)
                    .textFieldStyle(.plain)
                    .foregroundStyle(DesignTokens.Colors.ink1)
                    .padding(.vertical, DesignTokens.Spacing.space3)
                    .overlay(alignment: .bottom) {
                        Rectangle()
                            .fill(DesignTokens.Colors.hairline)
                            .frame(height: DesignTokens.Radius.hairlineWidth)
                    }
            }

            field("Apps to close") {
                Button {
                    pickerShown = true
                } label: {
                    HStack {
                        Text(selectionSummary)
                        Spacer()
                        Image(systemName: "chevron.right")
                    }
                    .foregroundStyle(DesignTokens.Colors.ink2)
                    .padding(.vertical, DesignTokens.Spacing.space3)
                }
            }

            field("For how long") {
                Picker("Minutes", selection: $controller.minutes) {
                    ForEach([5, 15, 25, 50], id: \.self) { Text("\($0) min").tag($0) }
                }
                .pickerStyle(.segmented)
            }

            Button {
                controller.start()
            } label: {
                Text("Start")
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, DesignTokens.Spacing.space4)
            }
            .background(controller.canStart
                        ? DesignTokens.Colors.accentBase
                        : DesignTokens.Colors.paperRaised)
            .foregroundStyle(controller.canStart
                             ? DesignTokens.Colors.accentOn
                             : DesignTokens.Colors.ink3)
            .clipShape(RoundedRectangle(cornerRadius: DesignTokens.Radius.radiusButton))
            .disabled(!controller.canStart)
        }
    }

    private var running: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.space4) {
            Text(remaining)
                .font(.system(size: DesignTokens.FontSize.numeralM,
                              weight: .regular, design: .monospaced))
                .foregroundStyle(DesignTokens.Colors.ink1)

            Text(controller.taskName)
                .font(.system(size: DesignTokens.FontSize.displayS, design: .serif))
                .foregroundStyle(DesignTokens.Colors.ink1)

            Text("The chosen apps are closed. Calls, messages, Maps and banking stay open.")
                .font(.footnote)
                .foregroundStyle(DesignTokens.Colors.ink2)

            Button("Finish early", role: .destructive) { controller.stop() }
                .tint(DesignTokens.Colors.ink3)
                .padding(.top, DesignTokens.Spacing.space4)
        }
    }

    private func field<Content: View>(_ label: String,
                                      @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.space2) {
            Text(label.uppercased())
                .font(.system(size: DesignTokens.FontSize.label, design: .monospaced))
                .tracking(1.8)
                .foregroundStyle(DesignTokens.Colors.ink3)
            content()
        }
    }

    // MARK: - Derived

    private var selectionSummary: String {
        let apps = controller.selection.applicationTokens.count
        let cats = controller.selection.categoryTokens.count
        if apps == 0 && cats == 0 { return "Choose apps" }
        var parts: [String] = []
        if apps > 0 { parts.append("\(apps) app\(apps == 1 ? "" : "s")") }
        if cats > 0 { parts.append("\(cats) categor\(cats == 1 ? "y" : "ies")") }
        return parts.joined(separator: " · ")
    }

    private var remaining: String {
        guard let endsAt = controller.endsAt else { return "--:--" }
        let seconds = max(0, Int(endsAt.timeIntervalSince(now)))
        return String(format: "%02d:%02d", seconds / 60, seconds % 60)
    }
}
