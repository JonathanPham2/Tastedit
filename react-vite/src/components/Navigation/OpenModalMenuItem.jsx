import { useModal } from '../../context/Modal';

function OpenModalMenuItem({
  className, //  this is for css purpose
  modalComponent, // component to render inside the modal
  itemText, // text of the button that opens the modal
  onItemClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();
  // if(showLogin) {
  //   setModalContent(modalComponent)
  // }

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <div className={className} onClick={onClick}>{itemText}</div>
  );
}

export default OpenModalMenuItem;
