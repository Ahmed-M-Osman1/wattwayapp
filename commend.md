yarn android --port 7777 --deviceId "emulator-5556"

ss.visionos.vendored_frameworks = "destroot/Library/Frameworks/universal/hermes.xcframework"

cd android && ./gradlew clean && cd ..
cd ios && xcodebuild clean && cd ..
yarn start --reset-cache
