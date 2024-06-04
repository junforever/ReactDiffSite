import { useRef, useImperativeHandle, forwardRef } from 'react'
import { IconContext } from 'react-icons'
import { BsInfoCircleFill } from 'react-icons/bs'
import PropTypes from 'prop-types'

const Modal = forwardRef((
  props,
  ref
) => {
  const modalRef = useRef(null)

  const handleModalOpen = () => {
    if (modalRef.current) {
      modalRef.current.showModal()
    }
  }

  useImperativeHandle(ref, () => ({
    handleModalOpen
  }))

  return (
    <>
      {
        props.showButton &&
        <div className="tooltip  tooltip-right" data-tip={props.btnText}>
          <button className="btn btn-ghost" onClick={handleModalOpen} >
            <IconContext.Provider value={{ className: 'text-2xl' }}>
              <BsInfoCircleFill />
            </IconContext.Provider>
          </button>
        </div>
      }
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg px-4">{ props.title }</h3>
          <p className="p-4" dangerouslySetInnerHTML={{ __html: props.content }} />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
})

Modal.displayName = 'Modal'

Modal.propTypes = {
  showButton: PropTypes.bool.isRequired,
  btnText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}

export default Modal
