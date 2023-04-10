import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  return (
    <footer className="p-3 sm:p-5 md:p-10 w-full max-w-[88rem] mx-auto">
      <div className="w-full bg-black rounded-md">
        <div className="p-4 sm:p-6 md:p-12 pb-8 flex flex-col">
          <a href="https://hiro.so" aria-label="Hiro Systems">
            <div className="hiro w-[54px] h-[54px]"></div>
          </a>
          {/* todo: link chainhooks */}
          <p className="my-4 md:my-6 text-sm text-neutral-0">
            This Ordinals Explorer is using the{" "}
            <a
              className="underline"
              href="https://docs.hiro.so/ordinals"
            >
              Hiro Ordinals API
            </a>{" "}
              powered by{" "}
            <a
              className="underline"
              href="https://github.com/hirosystems/chainhook"
            >
              Chainhooks
            </a>
            .
          </p>
          <div className="mt-10 flex flex-col md:flex-row justify-between text-center text-xs text-neutral-300 space-y-4 md:space-y-0">
            <div>
              {/* todo: links */}
              <a href="https://www.hiro.so/patent-pledge">Patent Pledge</a>{" "}
              &mdash;{" "}
              <a href="https://www.hiro.so/terms-privacy">Terms & Privacy</a>
            </div>
            <div className="space-x-3">
              <a href="https://twitter.com/hirosystems">
                {/* todo: find filled twitter icon */}
                <TwitterLogoIcon className="inline-block w-5 h-5 text-neutral-0" />
              </a>
              <a href="https://github.com/hirosystems">
                <GitHubLogoIcon className="inline-block w-[18px] h-[18px] text-neutral-0" />
              </a>
              <a href="https://hiro.so" className="inline-block">
                &copy; {new Date().getFullYear()} Hiro Systems PBC
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
