'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { format, addMinutes, startOfDay } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [openMenu, setOpenMenu] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const arr = [
    {
      dayName: "Monday",
    },
    {
      dayName: "Tuesday",
    },
    {
      dayName: "Wednesday",
    },
    {
      dayName: "Thusday",
    },
    {
      dayName: "Friday",
    },
    {
      dayName: "Saturday",
    },
    {
      dayName: "Sunday",
    },
  ]

  const handleAddSlot = (i) => {
    if (isTimeSlotValid(openMenu[i])) {
      setSelectedTimes((prevSelectedTimes) => [
        ...prevSelectedTimes,
        {
          day: openMenu[i].idx,
          startTime: openMenu[i].startTime,
          endTime: openMenu[i].endTime,
        },
      ]);
      toast.info('time updated suceessfully')
    } else {
      toast.error('Invalid time slot or already selected.');
    }
  };

  const handleTimeSelect_1 = (selectedTime, i) => {
    setOpenMenu((prevOpenMenu) => {
      const updatedMenu = [...prevOpenMenu];
      updatedMenu[i] = {
        ...updatedMenu[i],
        startTime: parseTimeTo24HourFormat(selectedTime),
      };

      return updatedMenu;
    });
  };
  const parseTimeTo24HourFormat = (time) => {
    const date = new Date(`2000-01-01 ${time}`);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };
  const handleTimeSelect_2 = (selectedTime, i) => {
    setOpenMenu((prevOpenMenu) => {
      const updatedMenu = [...prevOpenMenu];
      updatedMenu[i] = {
        ...updatedMenu[i],
        endTime: parseTimeTo24HourFormat(selectedTime),
      };
      return updatedMenu;
    });
  };
  const isTimeSlotValid = (dayInfo) => {
    return (
      dayInfo?.startTime &&
      dayInfo?.endTime &&
      dayInfo?.startTime < dayInfo?.endTime &&
      !selectedTimes.some(
        (slot) =>
          slot.day === dayInfo.idx &&
          ((slot.startTime <= dayInfo.startTime && dayInfo.startTime < slot.endTime) ||
            (slot.startTime < dayInfo.endTime && dayInfo.endTime <= slot.endTime) ||
            (dayInfo.startTime < slot.startTime && slot.endTime < dayInfo.endTime))
      )
    );
  };
  return (
    <div className="h-screen w-screen flex flex-col items-center p-10">
      <div className="font-bold text-xl">Set Availability</div>
      <table className="flex flex-col h-[22rem] w-[40rem] justify-evenly">
        <tbody>
          {arr.map((e, i) => {
            return (
              <>
                <tr key={i * 1} className="">
                  <td className="w-[6rem]">{e.dayName}</td>
                  <td className="w-[6rem]">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setOpenMenu((prevOpenMenu) => {
                          const updatedMenu = [...prevOpenMenu];
                          updatedMenu[i] = {
                            ...updatedMenu[i],
                            state: !updatedMenu[i]?.state,
                            idx: i,
                          };
                          return updatedMenu;
                        })
                      }
                    />
                  </td>
                  <td className="w-[6rem]">
                    {openMenu[i]?.state && openMenu[i]?.idx === i ? 'Open' : 'Close'}
                  </td>
                  <td className="w-[7rem]">
                    <TimeDropdown
                      interval={15}
                      isDisabled={
                        !(openMenu[i]?.state && openMenu[i]?.idx === i)
                      }
                      onSelect={(selectedTime) => handleTimeSelect_1(selectedTime, i)}
                    />
                  </td>
                  <td className="w-[7rem]">
                    <TimeDropdown
                      interval={15}
                      isDisabled={
                        !(openMenu[i]?.state && openMenu[i]?.idx === i)
                      }
                      onSelect={(selectedTime) => handleTimeSelect_2(selectedTime, i)}
                    />
                  </td>
                  <td className="w-[6rem]">
                    <button
                      className="bg-blue-900 text-white w-[8rem]"
                      onClick={() => handleAddSlot(i)}
                    >
                      Add Slot
                    </button>
                  </td>
                </tr>
                {
                  openMenu[i]?.state && selectedTimes.length > 0 &&
                  selectedTimes.map((e, j) => {
                    if (i === e.day) {
                      return (
                        <tr key={j}>
                          <td className="w-[6rem]">{arr[i].dayName}</td>
                          <td className="w-[6rem]"></td>
                          <td className="w-[6rem]"></td>
                          <td className="w-[7rem]">{e.startTime}</td>
                          <td className="w-[7rem]">{e.endTime}</td>
                          <td className="w-[6rem]"></td>
                        </tr>
                      );
                    } else {
                      return null;
                    }
                  })
                }
              </>
            );
          })}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

const TimeDropdown = ({ interval, onSelect, isDisabled }) => {
  const start = startOfDay(new Date());
  const options = [];

  for (let i = 0; i < 24 * 60; i += interval) {
    const time = addMinutes(start, i);
    const formattedTime = format(time, 'h:mm a');
    options.push({ value: formattedTime, label: formattedTime });
  }

  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <select disabled={isDisabled} onChange={handleChange}>
      <option>
        select
      </option>
      {options.map((option) => (
        <option defaultValue={'12:00 AM'} key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};