import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const POMODORO_DURATION = 25 * 60 * 1000 // 25 minutes in ms

const Home = () => {
    const [elapsed, setElapsed] = useState(POMODORO_DURATION) // ← Start at 25 min
    const [running, setRunning] = useState(false)
    const intervalRef = useRef(null)
    const lastTickRef = useRef(0)

    const timer = () => {
        lastTickRef.current = Date.now()
        intervalRef.current = setInterval(() => {
            const now = Date.now()
            const delta = now - lastTickRef.current
            lastTickRef.current = now

            setElapsed((prev) => {
                const next = prev - delta // ← Subtract instead of add
                if (next <= 0) {
                    clearInterval(intervalRef.current) // ← Stop at zero
                    setRunning(false)
                    return 0
                }
                return next
            })
        }, 10)
    }

    const pause = () => {
        clearInterval(intervalRef.current)
        intervalRef.current = null
    }

    const reset = () => {
        pause()
        setElapsed(POMODORO_DURATION) // ← Reset to 25 min
        setRunning(false)
    }

    const toggle = () => {
        if (!running) {
            timer()
            setRunning(true)
        } else {
            pause()
            setRunning(false)
        }
    }

    useEffect(() => () => clearInterval(intervalRef.current), [])

    const fmt = (ms) => {
        const s = Math.floor(ms / 1000)
        const min = String(Math.floor(s / 60)).padStart(2, "0")
        const sec = String(s % 60).padStart(2, "0")
        return `${min}:${sec}`
    }

    return (
        <div className="mt-6">
            <Card className="relative mx-auto w-full max-w-sm pt-0">
                <h1 className="my-5 text-center text-7xl">{fmt(elapsed)}</h1>
                <CardHeader>
                    <CardTitle className="text-center">
                        Pomodoro Timer
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-2">
                    {" "}
                    {/* ← gap for two buttons */}
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={toggle}
                        disabled={elapsed === 0}
                    >
                        {running ? "Pause" : "Start"}
                    </Button>
                    {/* <Button
                        className="w-full"
                        size="lg"
                        variant="outline"
                        onClick={reset}
                    >
                        Reset
                    </Button> */}
                </CardFooter>
            </Card>
        </div>
    )
}

export default Home
