import React from "react";

export default function GameList() {
  return (
    <main className="">
      <nav className="border-black bg-slate-900">
        <div className="max-w-screen-xl flex flex-wrap items-center mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="left-arrow.png" alt="" className="size-10" />
          </a>
          <span className="text-white text-2xl font-semibold ml-2">
            Game List
          </span>
        </div>
      </nav>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700 m-3">
        <li className="pb-3 sm:pb-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Neil Sims
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                email@flowbite.com
              </p>
            </div>
            <div className="items-center text-base font-semibold text-gray-900 dark:text-white">
              <span>Created at</span>
              <br />
              <span>Dec 29, 2020</span>
            </div>
          </div>
        </li>
      </ul>
    </main>
  );
}
