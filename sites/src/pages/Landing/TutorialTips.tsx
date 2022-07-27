import { AppLogo, FloatGlassButton, imageS1 } from './common'
import {
  ArrowCircleLeft,
  ArrowCircleRight, Brain, DiscordLogo,
  FrameCorners, MonitorPlay, Notebook, SignOut, Sparkle,
  StarFour,
} from 'phosphor-react'
import { LSButton } from '../../components/Buttons'
import { AnimateInTurnBox } from '../../components/Animations'
import cx from 'classnames'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useMounted } from '../../hooks'
import { promiseImages } from './index'

export function TipSlideItem (props: {
  inActive: boolean,
  headEmoji: string,
  headTitle: string,
  content: ReactNode | string,
  tips: Array<ReactNode | string>,
  complete?: () => void,
  activeTipChanged?: (tag: string) => void
  className?: string
}) {
  const {
    inActive,
    headEmoji,
    headTitle,
    content,
    className,
    tips,
    ...rest
  } = props
  const [activeTip, setActiveTip] = useState({ active: 0, progress: 0 })
  const [_tipProgressTimer, setProgressTimer] = useState<number>(0) // interval timer
  const isMounted = useMounted()

  const resetState = () => {
    setActiveTip({ active: 0, progress: 0 })
    setProgressTimer(0)
  }

  useEffect(() => {
    if (!isMounted.current) return

    if (!inActive) {
      clear()
      resetState()
      return
    }

    function clear () {
      setProgressTimer((timer) => {
        clearInterval(timer)
        return 0
      })
    }

    const tickHandler = () => {
      // async
      setActiveTip(({ active, progress }) => {
        let toProgress = progress + 2
        let toActive = active

        if (toProgress > 100) {
          if (active) {
            clear()
            props.complete?.()
            toProgress = 100
          } else {
            toProgress = 0
            toActive = 1
          }
        }

        return { active: toActive, progress: toProgress }
      })
    }

    function run () {
      clear()
      const timer = setInterval(tickHandler, 300)
      setProgressTimer(timer as any)
    }

    console.log('run ....')
    run()

    return clear
  }, [inActive])

  useEffect(() => {
    inActive && props.activeTipChanged?.(activeTip.active.toString())
  }, [activeTip.active, inActive])

  return (
    <div className={cx('item swiper-slide a', className)} {...rest}>
      {/*  Beginner */}
      <h1 className="flex">
        <strong className="text-3xl pr-4">{headEmoji}</strong>
        <LSButton
          className={'text-sm cursor-text'}
          leftIcon={<StarFour size={16}/>}
        >
          {headTitle}
        </LSButton>
      </h1>

      <h2 className="pt-2 text-3xl text-gray-300">
        {content}
      </h2>

      <strong className="progress">
        <i><small style={{
          width: (!activeTip.active ? activeTip.progress : 100) + '%',
        }}>1</small></i>
        <i><small
          style={{
            width: (!activeTip.active ? 0 : activeTip.progress) + '%',
          }}>2</small></i>
      </strong>

      <h3 className="flex text-lg space-x-2 px-1 py-2 tracking-wide">
        {tips.map((it, idx) => {
          if (activeTip.active !== idx) return

          return (
            <span className={'animate-in duration-1000 fade-in-0'} key={idx}>
              <strong>Tip{idx + 1}: </strong>
              <span className="text-gray-300/70">{it}</span>
            </span>
          )
        })}
      </h3>
    </div>
  )
}

export function TutorialTips () {
  const swiperElRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<Swiper>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTipTag, setActiveTipTag] = useState('00')
  const sidesLen = 3

  useEffect(() => {
    if (swiperRef.current) return

    // @ts-ignore
    const sw = swiperRef.current = new Swiper(
      swiperElRef.current!, {
        loop: false,
      },
    )

    sw.on('activeIndexChange', () => {
      setActiveIndex(sw.realIndex)
    })
  }, [])

  return (
    <div className="app-tutorial-tips">
      <AnimateInTurnBox
        ticks={[500, 1, 300, 1]}
        className="hd flex flex-col justify-center items-center">
        {(t: Array<any>) => (<>
          <h1 className={cx('invisible flex items-center',
            t[0] && 'ani-slide-in-from-bottom')}>
            <span className="pr-5 opacity-60">
              Braindump everything into
            </span>
            <AppLogo className="w-16 h-16"/>
            <span className="pl-2 opacity-60">.</span>
          </h1>
          <h2 className={cx('invisible', t[1] && 'ani-slide-in-from-bottom')}>
            New ideas will pop up with time.
          </h2>

          <h3 className={cx('invisible', t[2] && 'ani-fade-in')}>
            Using Logseq helps you organize your thoughts and ideas
          </h3>
          <h4 className={cx('invisible', t[3] && 'ani-fade-in')}>
            <span className="opacity-60">so that you can</span>
            <span className="opacity-100 pl-1">
          come up with new outputs more easily.
          </span>
          </h4>
        </>)
        }
      </AnimateInTurnBox>
      <div className="bd flex">
        <div ref={swiperElRef} className="bd-slides swiper">
          <div className="items swiper-wrapper">
            {/* 1 */}
            <TipSlideItem
              inActive={activeIndex === 0}
              headEmoji={'✍️'}
              headTitle={'Beginner'}
              content={<span>Get in the habit of writing <br/>thoughts down every day.</span>}
              tips={[
                'Think in sections, use indentation.',
                'Use links & hashtags.',
              ]}
              complete={() => {
                swiperRef.current?.slideNext()
              }}
              activeTipChanged={(tag) => {
                setActiveTipTag?.(`0${tag}`)
              }}

            />

            {/* 2 */}
            <TipSlideItem
              inActive={activeIndex === 1}
              headEmoji={'🔍️'}
              headTitle={'Intermediate'}
              content={<span>Always find what you’re <br/> looking for.</span>}
              tips={[
                'Use CMD-K to search with ease.',
                <span className={'text-lg'}>Go through linked references to find valuable information nuggets from the past.</span>,
              ]}
              complete={() => {
                swiperRef.current?.slideNext()
              }}
              activeTipChanged={(tag) => {
                setActiveTipTag?.(`1${tag}`)
              }}
            />

            {/*  3 */}
            <TipSlideItem
              inActive={activeIndex === 2}
              headEmoji={'💼️'}
              headTitle={'Expert'}
              content={<span>Create your own processes.</span>}
              tips={[
                <span>Use queries to generate tables of <br/> relevant information.</span>,
                'Install plugins and customize the app around your workflow needs.',
              ]}
              complete={() => {
                swiperRef.current?.slideNext()
              }}
              activeTipChanged={(tag) => {
                setActiveTipTag?.(`2${tag}`)
              }}
            />
          </div>
        </div>

        <div className="bd-actions flex">
          <span className="prev" title={'Previous'}
                onClick={() => swiperRef.current?.slidePrev()}
          >
           <ArrowCircleLeft size={26}/>
          </span>

          <div
            className="dots flex space-x-3 rounded-2xl bg-gray-700/40 py-2 px-4 items-center">
            {Array(sidesLen).fill(0).map((_, i) => {
              return (
                <i key={i}
                   className={cx(
                     'w-2 h-2 bg-logseq-100/50 rounded-2xl cursor-pointer select-none hover:opacity-80',
                     (i === activeIndex) && '!bg-white/90')}
                   onClick={() => {
                     swiperRef.current?.slideTo(i)
                   }}
                ></i>
              )
            })}
          </div>

          <span className="next" title={'Next'}
                onClick={() => swiperRef.current?.slideNext()}
          >
              <ArrowCircleRight size={26}/>
            </span>
        </div>

        <div className="bd-info">
          <div className="flex">
            <img className={'animate-in fade-in-0 duration-1000'}
                 src={promiseImages[activeTipTag]} alt="image"/>
          </div>

          <FloatGlassButton className="absolute right-6 bottom-5">
            <FrameCorners
              className={'font-bold cursor-pointer'}
              size={26}
              weight={'duotone'}
            />
          </FloatGlassButton>
        </div>
      </div>

      {/*  more resources */}
      <div className="ft flex h-28 mt-28">
        <div className="flex-1 flex flex-col justify-center items-center">
          <h2 className="text-2xl">More Resources</h2>
          <div className="flex space-x-6 py-5">
            <div>
              <LSButton
                leftIcon={<MonitorPlay size={24}/>}>
                Community Hub
              </LSButton>
              <span
                className="text-[11px] inline-block pt-2 text-center w-full text-gray-400/80">
                Accessible content for new users
              </span>
            </div>

            <div>
              <LSButton
                className="bg-logseq-700"
                leftIcon={<Notebook size={24}/>}>
                Documentation
              </LSButton>
              <span
                className="text-[11px] inline-block pt-2 text-center w-full text-gray-400/80">
                Feature details
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center items-center border-l border-l-logseq-500">
          <h2 className="text-2xl tracking-wide">A helpful community</h2>
          <div className="flex flex-col space-x-2 pt-10 -translate-y-6">
            <LSButton
              className="bg-[#7289da] px-6"
              leftIcon={<DiscordLogo size={20}/>}
              rightIcon={<SignOut className="opacity-40" size={20}/>}
            >
              Join our Discord
            </LSButton>

            <span
              className="text-[12px] flex items-center pt-2 justify-center text-gray-400/80">
              <strong className="h-2 w-2 bg-green-600 rounded"></strong>
              <strong className="pl-2 pr-1">1,000</strong>
              users online currently
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
