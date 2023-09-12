import { PropsWithChildren } from "react";
import Backdrop from "./backdrop";

type ModalProps = {
  title: string;
  cancelFn: () => void;
  confirmFn: () => void;
};

const Button = ({ fn, children }: PropsWithChildren<{ fn: () => void }>) => {
  return (
    <button
      className="px-4 py-2 border-2 border-dark-bg-color"
      onClick={(e) => {
        e.preventDefault;
        fn();
      }}
    >
      {children}
    </button>
  );
};

const Modal = ({
  title,
  children,
  cancelFn,
  confirmFn,
}: PropsWithChildren<ModalProps>) => {
  return (
    <>
      <Backdrop />
      <div className="flex flex-col items-center gap-6 fixed left-[5%] md:left-[calc((100%-50rem)/2)] top-[20vh] w-[90%] md:w-[50rem] shadow-2xl bg-light-bg-color p-8">
        <header className="w-full text-center">
          <h2 className="text-xl bg-dark-bg-color text-dark-text-color p-2">
            {title}
          </h2>
        </header>
        <section className="w-full md:w-[60%]">{children}</section>
        <section className="flex justify-center gap-8 w-full">
          <Button fn={cancelFn}>Cancel</Button>
          <Button fn={confirmFn}>Confirm</Button>
        </section>
      </div>
    </>
  );
};

export default Modal;
