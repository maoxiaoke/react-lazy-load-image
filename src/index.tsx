import React, { ReactNode, useState, useRef, useLayoutEffect, AriaAttributes, CSSProperties, ReactElement, useEffect } from 'react';
import * as classNames from 'classnames';
import { useInViewport } from 'ahooks';

import styles from './index.module.less';

export type NativeProps<S extends string = never> = {
  className?: string;
  style?: CSSProperties & Partial<Record<S, string>>;
  tabIndex?: number;
} & AriaAttributes;

export function withNativeProps<P extends NativeProps>(
  props: P,
  element: ReactElement,
) {
  const p = {
    ...element.props,
  };
  if (props.className) {
    p.className = classNames(element.props.className, props.className);
  }
  if (props.style) {
    p.style = {
      ...p.style,
      ...props.style,
    };
  }
  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }
  for (const key in props) {
    if (!props.hasOwnProperty(key)) continue;
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      p[key] = props[key];
    }
  }
  return React.cloneElement(element, p);
}

export function toCSSLength(val: string | number) {
  return typeof val === 'number' ? `${val}px` : val;
}

export const BrokenImageIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="https://www.w3.org/2000/svg">
    <path
      // eslint-disable-next-line max-len
      d="M19.233 6.233 17.42 9.08l-10.817.001a.665.665 0 0 0-.647.562l-.007.096V34.9l5.989-8.707a2.373 2.373 0 0 1 1.801-1.005 2.415 2.415 0 0 1 1.807.625l.126.127 4.182 4.525 2.267-3.292 5.461 7.841-4.065 7.375H6.604c-1.86 0-3.382-1.47-3.482-3.317l-.005-.192V9.744c0-1.872 1.461-3.405 3.296-3.505l.19-.005h12.63Zm22.163 0c1.86 0 3.382 1.472 3.482 3.314l.005.192v29.14a3.507 3.507 0 0 1-3.3 3.505l-.191.006H27.789l3.63-6.587.06-.119a1.87 1.87 0 0 0-.163-1.853l-6.928-9.949 3.047-4.422a2.374 2.374 0 0 1 1.96-1.01 2.4 2.4 0 0 1 1.86.87l.106.14L42.05 34.89V9.74a.664.664 0 0 0-.654-.658H21.855l1.812-2.848h17.73Zm-28.305 5.611c.794 0 1.52.298 2.07.788l-.843 1.325-.067.114a1.87 1.87 0 0 0 .11 1.959l.848 1.217c-.556.515-1.3.83-2.118.83a3.122 3.122 0 0 1-3.117-3.116 3.119 3.119 0 0 1 3.117-3.117Z"
      fill="#DBDBDB"
      fillRule="nonzero"
    />
  </svg>
);

export const ImageIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="https://www.w3.org/2000/svg">
    <path
      // eslint-disable-next-line max-len
      d="M41.396 6.234c1.923 0 3.487 1.574 3.487 3.505v29.14c0 1.937-1.568 3.51-3.491 3.51H6.604c-1.923 0-3.487-1.573-3.487-3.51V9.745c0-1.936 1.564-3.51 3.487-3.51Zm0 2.847H6.604c-.355 0-.654.3-.654.658V34.9l5.989-8.707a2.373 2.373 0 0 1 1.801-1.005 2.405 2.405 0 0 1 1.933.752l4.182 4.525 7.58-11.005a2.374 2.374 0 0 1 1.96-1.01c.79 0 1.532.38 1.966 1.01L42.05 34.89V9.74a.664.664 0 0 0-.654-.658Zm-28.305 2.763a3.119 3.119 0 0 1 3.117 3.117 3.119 3.119 0 0 1-3.117 3.117 3.122 3.122 0 0 1-3.117-3.117 3.119 3.119 0 0 1 3.117-3.117Z"
      fill="#DBDBDB"
      fillRule="nonzero"
    />
  </svg>
);

export type ImageProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  // fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  placeholder?: ReactNode;
  fallback?: ReactNode;
  lazy?: boolean | IntersectionObserverInit;
  draggable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onContainerClick?: (event: React.MouseEvent<HTMLDivElement, Event>) => void;
} & NativeProps<'--width' | '--height'> &
Pick<
React.ImgHTMLAttributes<HTMLImageElement>,
| 'crossOrigin'
| 'decoding'
| 'loading'
| 'referrerPolicy'
| 'sizes'
| 'srcSet'
| 'useMap'
>;

export const LazyDetector = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inViewport] = useInViewport(ref, {
    // 在距离视口  50 px 就开始加载
    rootMargin: '50px',
  });

  useEffect(() => {
    if (inViewport) {
      props.onActive();
    }
  }, [inViewport]);

  // 调整这里的样式，以避免目前 umc/image 组件的 bug
  return <div ref={ref} className={styles.imageLazy} />;
};


const defaultProps = {
  placeholder: (
    <div className={styles.imageTip}>
      <UBBrand className={styles.imagePlaceholder} />
    </div>
  ),
  fallback: (
    <div className={styles.imageTip}>
      <BrokenImageIcon />
    </div>
  ),
  lazy: false,
  draggable: false,
};

const Image =((p: ImageProps) => {
  const props = {
    ...defaultProps,
    ...p,
  };

  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  let { src } = props;
  let { srcSet } = props;

  const [initialized, setInitialized] = useState(!props.lazy);

  src = initialized ? props.src : undefined;
  srcSet = initialized ? props.srcSet : undefined;

  useLayoutEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  function renderInner() {
    if (failed) {
      return <>{props.fallback}</>;
    }
    const img = (
      <img
        className={styles.imageImg}
        src={src}
        alt={props.alt}
        onClick={props.onClick}
        onLoad={(e) => {
          setLoaded(true);
          props.onLoad?.(e);
        }}
        onError={(e) => {
          setFailed(true);
          props.onError?.(e);
        }}
        style={{
          objectFit: props.fit,
          display: loaded ? 'block' : 'none',
        }}
        crossOrigin={props.crossOrigin}
        decoding={props.decoding}
        loading={props.loading}
        referrerPolicy={props.referrerPolicy}
        sizes={props.sizes}
        srcSet={srcSet}
        useMap={props.useMap}
        draggable={props.draggable}
      />
    );
    return (
      <>
        {!loaded && props.placeholder}
        {img}
      </>
    );
  }

  const style: ImageProps['style'] = {};
  if (props.width) {
    style['--width'] = toCSSLength(props.width);
    style['width'] = toCSSLength(props.width);
  }
  if (props.height) {
    style['--height'] = toCSSLength(props.height);
    style['height'] = toCSSLength(props.height);
  }
  return (
    <div
      ref={ref}
      className={styles.image}
      style={style}
      onClick={props.onContainerClick}
    >
      {props.lazy && !initialized && (
        <LazyDetector
          onActive={() => {
            setInitialized(true);
          }}
        />
      )}
      {renderInner()}
    </div>
  )
});

export default Image;
