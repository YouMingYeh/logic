"use client"
import {
  DotLottieReact,
  DotLottieReactProps,
} from '@lottiefiles/dotlottie-react';

export type LottieProps = DotLottieReactProps;

export const Lottie = (props: LottieProps) => {
  return <DotLottieReact {...props} />;
};
