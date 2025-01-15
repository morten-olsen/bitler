import { useEventEffect, useRunCapabilityQuery } from "@bitler/react";
import React, { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@nextui-org/react";

const timeUntil = (futureTime: Date): string => {
  const now = new Date();
  const diff = futureTime.getTime() - now.getTime();

  if (diff <= 0) {
    return "00:00:00"; // If the future time has already passed
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  const pad2 = (num: number): string => num.toString().padStart(2, '0');

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
};

const Timers = () => {
  const [time, setTime] = useState(new Date());
  const timers = useRunCapabilityQuery('timers.list', {}, {
    queryKey: ['timers.list'],
  });
  useEventEffect(
    'timer.updated',
    {},
    () => {
      console.log('got update');
      timers.refetch();
    },
    [timers.refetch]
  );

  useEventEffect(
    'timer.triggered',
    {},
    (timer) => {
      alert(`Timer ${timer.id} triggered`);
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerInfo = useMemo(
    () => timers.data?.timers.map((timer) => ({
      id: timer.id,
      description: timer.description,
      duration: timer.duration,
      trigger: new Date(new Date(timer.start).getTime() + timer.duration * 1000),
      timeLeft: timer.duration - Math.floor((time.getTime() - new Date(timer.start).getTime()) / 1000),
    })).sort((a, b) => a.timeLeft - b.timeLeft),
    [timers.data, time]
  );

  const timerInfoShort = useMemo(
    () => timerInfo && timerInfo.length > 0 ? ({
      nextTimer: timerInfo[0],
      totalTimers: timerInfo.length,
    }) : undefined,
    [timerInfo]
  );

  if (!timerInfoShort) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Badge content={timerInfoShort.totalTimers.toString()}>
        <Clock className="w-5 h-5 text-primary" />
      </Badge>

      <div className="text-xs">{timeUntil(timerInfoShort.nextTimer.trigger)}</div>
    </div>
  )
}

export { Timers };
