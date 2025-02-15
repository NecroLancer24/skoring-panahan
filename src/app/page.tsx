export default function Home() {
  return (
    <main className="">
      <nav className="border-black bg-slate-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="text-white text-2xl font-semibold">
              Score Counter
            </span>
          </a>
        </div>
      </nav>

      <div className="flex flex-col justify-center items-center pt-5">
        <a href={`/newgame`}>
          <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-semibold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 font-samibold w-60 h-20">
            Create New Game
          </button>
        </a>
        <a href={`/gamelist`}>
          <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-semibold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-60 h-20">
            Game List
          </button>
        </a>
        <a href={`/playerlist`}>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-60 h-20">
            Player List
          </button>
        </a>
      </div>
    </main>
  );
}
