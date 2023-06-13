import { cn } from "../lib/utils";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex", className)} aria-label="Loading">
      <span className="spinner m-auto animate-[spin_2s_linear_infinite]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="47"
          className="animate-pulse"
        >
          <path
            fill="#CFC9C2"
            fillRule="nonzero"
            d="M16.368 0c9.992 0 16.236 8.206 16.366 21.998l.002.442v2.112c0 14.058-6.27 22.44-16.368 22.44-9.992 0-16.236-8.206-16.366-21.998L0 24.552V22.44C0 8.382 6.27 0 16.368 0Zm10.296 15.708L7.854 36.564c1.914 3.498 4.818 5.412 8.514 5.412 6.775 0 10.785-6.237 10.888-17.187l.002-.435v-1.716c0-2.36-.166-4.497-.5-6.413l-.094-.517ZM16.368 4.95c-6.775 0-10.785 6.301-10.888 17.253l-.002.435v1.716c0 2.36.166 4.497.5 6.362l.094.502 18.81-20.724c-1.848-3.63-4.752-5.544-8.514-5.544Z"
          />
        </svg>
      </span>
    </div>
  );
};

export default Loading;

// import { Loader, Loader2 } from "lucide-react";

// const Loading = () => {
//   return (
//     <div className="flex h-screen">
//       <Loader
//         width="36px"
//         height="36px"
//         color="#CFC9C2"
//         className="m-auto animate-spin animate-pulse"
//       />
//     </div>
//   );
// };

// export default Loading;
