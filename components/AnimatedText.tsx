import React, { useEffect, useRef, useState } from "react";
import { easeCircleIn } from "d3";

type AnimatedTextProps = {
  children: string | string[];
};

/*
  This component displays characters of a string 1 by 1,
  followed by a certain number of a random characters
*/

const ALPHABET = "ABCDEFGHIJKLMNPKRSTUVWXYZ".split("");
const ALLOWED_CHARS = "0123456789&Ӿ₿".split("").concat(ALPHABET);
function getRandomChar() {
  return ALLOWED_CHARS[Math.floor(Math.random() * ALLOWED_CHARS.length)];
}
// to be displayed after the original string
const NB_OF_EXTRA_RANDOM_CHARS = 6;
// nb of times we display and random char before showing the expected on
const NB_OF_ITERATIONS = 8;

const AnimatedText = ({ children }: AnimatedTextProps) => {
  const originalText = useRef(
    ([] as string[]).concat(children).join("").split("")
  );
  const [text, setText] = useState<string[]>([getRandomChar()]);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iterations = useRef(0);

  useEffect(() => {
    const currentLength = text.length;
    const remaining = Math.min(
      NB_OF_EXTRA_RANDOM_CHARS,
      originalText.current.length - currentLength
    );
    if (
      text.length <= originalText.current?.length + remaining &&
      text.join("") !== originalText.current.join("")
    ) {
      iterations.current += 1;
      // every N iterations, add one expected character to the string
      let progress = iterations.current % NB_OF_ITERATIONS === 0 ? 1 : 0;

      let progressRatio = text.length / originalText.current.length;

      timeout.current = setTimeout(() => {
        timeout.current = null;

        /*
          Here we build the new array value with
          [
            ...[<target_length - N characters of the original string>]
            ...[N random characters]
          ]
        */
        const newValue = [
          ...originalText.current.slice(
            0,
            Math.max(0, currentLength + progress - remaining)
          ),
          ...new Array(NB_OF_EXTRA_RANDOM_CHARS)
            .fill("")
            .map(() => getRandomChar())
            .slice(0, Math.max(0, remaining)),
        ];
        setText(newValue);
      }, 0.1 + 6 * (1 - easeCircleIn(progressRatio)));
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [text, originalText]);

  return <>{text.join("")}</>;
};

export default AnimatedText;
