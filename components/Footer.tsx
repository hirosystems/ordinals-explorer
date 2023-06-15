import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import IconTwitter from "./icons/IconTwitter";

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-[88rem] p-3 sm:p-5 md:p-10">
      <div className="w-full rounded-md bg-black">
        <div className="flex flex-col p-4 pb-8 sm:p-6 md:p-12">
          <a href="https://hiro.so" aria-label="Hiro Systems">
            <div className="hiro h-[54px] w-[54px]"></div>
          </a>
          {/* todo: link chainhooks */}
          <p className="my-4 text-sm text-neutral-0 md:my-6">
            This Ordinals Explorer is using the{" "}
            <a className="underline" href="https://docs.hiro.so/ordinals">
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
          <div className="mt-10 flex flex-col justify-between space-y-4 text-center text-xs text-neutral-300 md:flex-row md:space-y-0">
            <div>
              {/* todo: links */}
              <a href="https://www.hiro.so/patent-pledge">Patent Pledge</a>{" "}
              &mdash;{" "}
              <a href="https://www.hiro.so/terms-privacy">Terms & Privacy</a>
            </div>
            <div className="flex justify-center space-x-3">
              <a href="https://twitter.com/hirosystems">
                {/* todo: find filled twitter icon */}
                <IconTwitter className="inline-block h-3.5 text-neutral-0" />
              </a>
              <a href="https://github.com/hirosystems">
                <GitHubLogoIcon className="inline-block h-[18px] w-[18px] text-neutral-0" />
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
