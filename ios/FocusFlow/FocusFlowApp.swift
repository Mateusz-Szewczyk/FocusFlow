import SwiftUI

@main
struct FocusFlowApp: App {
    @State private var controller = SessionController()

    var body: some Scene {
        WindowGroup {
            RootView(controller: controller)
                .preferredColorScheme(.dark)
                .task { await controller.requestAuthorization() }
                .onAppear { controller.refreshFromStore() }
        }
    }
}
