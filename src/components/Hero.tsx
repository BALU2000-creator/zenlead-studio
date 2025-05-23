
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 py-20">
      <div className="absolute inset-0 z-0 bg-[url('/waveform-pattern.svg')] bg-center opacity-10"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center relative z-10">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Zenlead
            </span>
            <span className="block mt-2">AI Technologies as a Magic</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Supercharge your works with cutting-edge AI. Seamlessly translate audio, create stunning videos, 
          summarize content, and, as a student, optimize your resume to skyrocket your job.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/app"
              className="rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link to="/pricing" className="text-lg font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:text-primary">
              View Pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};
