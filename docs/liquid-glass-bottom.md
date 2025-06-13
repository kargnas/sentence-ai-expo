https://www.youtube.com/watch?v=L5f8Gy91Gv4

Of course! Here is a detailed explanation of how to use the "Liquid Glass" effect in an Expo application, based on the provided video.

The effect, which the speaker calls "Liquid Glass," is a new UI design introduced in iOS 26. In React Native and Expo, this is achieved by using a library that leverages the **native** iOS tab bar components, allowing it to automatically adopt the latest operating system styles.

The library used in the video is **`react-native-bottom-tabs`** by Oskar Kwaśniewski (Callstack).

### Summary of Key Features

*   **Native Look & Feel:** It uses the actual iOS and Android bottom tab components, not a JavaScript-based recreation.
*   **"Liquid Glass" Effect:** On iOS 26+, the tab bar automatically gets a translucent, blurry, and adaptive background that changes color based on the content scrolling behind it.
*   **Adaptive Icons:** The icon colors automatically change for better contrast against the background (e.g., they turn white when over a dark background).
*   **Performance:** Because it's native, it's highly performant and responsive to gestures.
*   **SF Symbols:** It has built-in support for Apple's SF Symbols, including autocomplete in your editor.

---

### Step-by-Step Guide to Implement Liquid Glass Tabs

Here’s how to set up your Expo project to use these native bottom tabs. This guide assumes you are using **Expo Router**.

#### Step 1: Install Dependencies

First, you need to install the necessary packages. Open your terminal in your project's root directory and run the following command. Using `npx expo install` is recommended as it installs compatible versions of the packages.

```bash
npx expo install react-native-bottom-tabs @bottom-tabs/react-navigation expo-build-properties
```

*   `react-native-bottom-tabs`: The core library that provides the native components.
*   `@bottom-tabs/react-navigation`: An adapter that makes the library work seamlessly with React Navigation and, by extension, Expo Router.
*   `expo-build-properties`: A utility to configure native build settings directly from your `app.json`.

#### Step 2: Configure `app.json`

Because this library uses native code, you need to configure it in your `app.json` file. This involves adding two plugins.

1.  Open your `app.json` file.
2.  Find the `plugins` array. If it doesn't exist, create it.
3.  Add the following configuration. This tells Expo to include the native code for the bottom tabs and to configure the iOS build to use static frameworks, which is required.

```json
{
  "expo": {
    "name": "your-app-name",
    "slug": "your-app-slug",
    // ... other settings
    "plugins": [
      "expo-router", // Make sure expo-router is still here
      [
        "react-native-bottom-tabs",
        {
          "translucent": true
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
  }
}
```

#### Step 3: Create a Development Build

This library contains native code, so you **cannot** use the standard Expo Go app. You must create a custom **development build** for your project.

Run one of the following commands in your terminal:

```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

This command will:
1.  Generate the native `ios` and `android` folders for your project using `prebuild`.
2.  Install the native dependencies (like CocoaPods for iOS).
3.  Build and install a new app on your simulator or connected device. This new app is your custom development client.

#### Step 4: Implement the Tab Layout

Now, you will replace your existing JavaScript-based tabs with the new native ones.

1.  Navigate to your tab layout file, which is typically `app/(tabs)/_layout.tsx`.
2.  Replace the entire content of the file with the code below.

```tsx
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { withLayoutContext } from 'expo-router';

// This is the important part:
// 1. We create a native tab navigator.
const { Navigator } = createNativeBottomTabNavigator();

// 2. We make it compatible with Expo Router's Layouts.
export const Tabs = withLayoutContext<
  React.ComponentProps<typeof Navigator>
>(Navigator);

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // This corresponds to app/(tabs)/index.tsx
        options={{
          title: 'Doggy Gallery',
          // Use Apple's SF Symbols for icons.
          // The library provides autocomplete for these!
          tabBarIcon: (props) => ({ sfSymbol: 'dog.fill' }),
        }}
      />
      <Tabs.Screen
        name="explore" // This corresponds to app/(tabs)/explore.tsx
        options={{
          title: 'Explore',
          tabBarIcon: (props) => ({ sfSymbol: 'paperplane.fill' }),
          // You can also add a badge
          tabBarBadge: '1',
        }}
      />
    </Tabs>
  );
}
```

**Key Changes:**
*   We are no longer importing `Tabs` from `expo-router`.
*   We use `createNativeBottomTabNavigator` and `withLayoutContext` to create our own `Tabs` component that is powered by native code.
*   The `tabBarIcon` now accepts an object with an `sfSymbol` property, which makes it incredibly easy to use any of Apple's system icons.

#### Step 5: Start the App with the Development Client

Finally, start your Metro server using the `--dev-client` flag.

```bash
npx expo start --dev-client
```

Scan the QR code with the Camera app on your iOS device or simulator. Make sure to open it in your **newly built app** (e.g., "Doggy Gallery"), not the standard Expo Go app.

You should now see your app running with the beautiful, native "Liquid Glass" bottom tabs