/*
- ReactNative / Expo / expo-splash-screen
- TypeScript
- 起動画面（SplashScreen）をアニメーション
- スプラッシュ画像はダウンロードではなくアプリにバンドルする画像を参照(propsで渡す)
- SplashScreenが非表示になったあとに表示したいコンポーネントはchildrenとして渡す
*/

import type { ReactNode } from 'react'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import Constants from 'expo-constants'

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
})

type ContainerProps = {
  children: ReactNode
  imagePath: number
}

type Props = {
  isAppReady: boolean
  isSplashComplete: boolean
  splashResizeMode: 'cover' | 'contain'
  backGroundColor: string
  animation: Animated.Value
  onImageLoaded: () => void
} & ContainerProps

// Presentation Component
const Presentation: FC<Props> = ({
  isAppReady,
  isSplashComplete,
  animation,
  imagePath,
  onImageLoaded,
  splashResizeMode,
  backGroundColor,
  children,
}) => (
  <View style={{ flex: 1 }}>
    {isAppReady && children}
    {isSplashComplete || (
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: backGroundColor,
            opacity: animation,
          },
        ]}
      >
        <Animated.Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: splashResizeMode,
          }}
          source={imagePath}
          onLoadEnd={onImageLoaded}
          fadeDuration={0}
        />
      </Animated.View>
    )}
  </View>
)

// Container Component
export const AnimatedSplashScreen: FC<ContainerProps> = ({ children, imagePath }) => {
  const [isAppReady, setIsAppReady] = useState(false)
  const [isSplashComplete, setIsSplashComplete] = useState(false)
  const animation = useMemo(() => new Animated.Value(1), [])
  const backGroundColor = useMemo(() => Constants.expoConfig?.splash?.backgroundColor ?? 'white', [])
  const splashResizeMode = useMemo(() => Constants.expoConfig?.splash?.resizeMode ?? 'contain', [])

  useEffect(() => {
    // isAppReadyがtrueになったらアニメーションを開始
    if (isAppReady) {
      // ここでアニメーションの内容を指定
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setIsSplashComplete(true))
    }
  }, [isAppReady, animation])

  // 画像の準備ができたら実行される関数
  // Animated.ImageのonLoadEnd属性に渡している
  const onImageLoaded = useCallback(() => {
    void (async () => {
      try {
        await SplashScreen.hideAsync()
      } catch (e) {
        console.log(e)
      } finally {
        // アプリの準備ができたフラグであるisAppReadyをtrueにする
        setIsAppReady(true)
      }
    })()
  }, [])

  // 起動後にホーム画面へ戻ってきたときにはSplashScreenを非表示にする（アニメーションしない）
  if (isSplashComplete) onImageLoaded()
  return (
    <Presentation
      {...{
        isAppReady,
        children,
        isSplashComplete,
        animation,
        imagePath,
        onImageLoaded,
        splashResizeMode,
        backGroundColor,
      }}
    />
  )
}
