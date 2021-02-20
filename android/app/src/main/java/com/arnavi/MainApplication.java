package com.arnavi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import li.yunqi.rnsecurestorage.RNSecureStoragePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.joshblour.reactnativeheading.ReactNativeHeadingPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.reactnative.maskedview.RNCMaskedViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.viromedia.bridge.ReactViroPackage;
import com.airbnb.android.react.maps.MapsPackage;
 import com.airbnb.android.react.lottie.LottiePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSecureStoragePackage(),
            new SplashScreenReactPackage(),
            new RNAndroidLocationEnablerPackage(),
            new AsyncStoragePackage(),
            new GeolocationPackage(),
            new RNUUIDGeneratorPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new ReactNativeHeadingPackage(),
            new RNScreensPackage(),
            new SafeAreaContextPackage(),
            new RNGestureHandlerPackage(),
            new RNCMaskedViewPackage(),
            new ReactViroPackage(ReactViroPackage.ViroPlatform.valueOf(BuildConfig.VR_PLATFORM)),
            new MapsPackage(),
            new LottiePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
