import { PropsWithChildren } from "react";
import Backdrop from "./backdrop";



type ModalProps = {
  title: string;
  cancelFn: () => void;
  confirmFn: () => void;
  btnText:string
};

const Button = ({
  fn,
  children,
  className
}: PropsWithChildren<{ fn: () => void, className:string }>) => {
  return (
    <button
      className={`px-4 py-2 border-2 border-dark-bg-color active:actionshrink ${className}`}
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
  btnText
}: PropsWithChildren<ModalProps>) => {
  return (
    <>
      <Backdrop />
      <div className="flex flex-col items-center gap-6 fixed left-[5%] md:left-[calc((100%-50rem)/2)] top-[20vh] w-[90%] md:w-[50rem] shadow-2xl bg-light-bg-color p-8 z-50">
        <header className="w-full text-center">
          <h2 className="text-xl bg-dark-bg-color text-dark-text-color p-2">
            {title}
          </h2>
        </header>
        <section className="w-full md:w-[80%]">{children}</section>
        <section className="flex justify-center gap-8 w-full">
          <Button className="" fn={cancelFn}>
            Cancel
          </Button>
          <Button className="bg-dark-bg-color text-dark-text-color" fn={confirmFn}>
            {btnText}
          </Button>
        </section>
      </div>
    </>
  );
};

export default Modal;
