Firebase native setup

Place your native Firebase config files for each environment here.

Android
- Register an Android app in the Firebase console (use package name from `android/app/src/main/AndroidManifest.xml`).
- Download `google-services.json` and place it at `android/app/google-services.json`.

iOS
- Register an iOS app in the Firebase console (use your Xcode bundle id).
- Download `GoogleService-Info.plist` and add it to the Xcode project (e.g. `ios/PantryToPlate/`), and include it in the app target.

Security
- Do NOT commit the real `google-services.json` or `GoogleService-Info.plist` files. Example files are in this folder: `firebase/google-services.json.example` and `firebase/GoogleService-Info.plist.example`.

Emulators
- To run locally against emulators, use:

```bash
# start functions + firestore + auth emulators
firebase emulators:start --project pantrytoplate-1773751381 --only functions,firestore,auth
```

Deploying functions
- Store webhook secret (RevenueCat) before deploying (recommended):

```bash
# set a runtime config value (functions.config())
firebase functions:config:set revenuecat.webhook_secret="YOUR_SECRET"
```

- Then deploy:

```bash
npm --prefix functions run build
firebase deploy --only functions,firestore:rules --project pantrytoplate-1773751381
```

Cloud Vision OCR
- Enable the Cloud Vision API in your GCP project (the deploy process may enable it automatically).
- The app calls a callable function `analyzeImage` which accepts `{ imageBase64?: string, imageUri?: string }` and returns `{ items: Array<{name, quantity?, unit?, raw?}> }`.
- To use camera images from the app, convert images to data URLs (base64) and pass them to `detectItemsFromImage`.

Example (emulator):
```bash
# call analyzeImage via emulator (example using curl against emulator HTTP endpoint):
curl -X POST "http://127.0.0.1:5001/pantrytoplate-1773751381/us-central1/analyzeImage" \
	-H "Content-Type: application/json" \
	-d '{"data": {}}'
```
