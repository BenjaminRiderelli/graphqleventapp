import style from './spinner.module.css';

const Spinner = () => (
  <div className={style.spinner}>
    <div className={style.ldsDualRing} />
  </div>
);

export default Spinner;