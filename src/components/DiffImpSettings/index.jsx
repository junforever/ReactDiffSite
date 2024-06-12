import { useRef, useState } from 'react'
import { IconContext } from 'react-icons'
import { FaFileImport } from 'react-icons/fa'
import Modal from '../Modal'
import PropTypes from 'prop-types'
import { parseJSON, objectPropertiesCompare, IMPORT_SETTINGS } from '../../utils'

function DiffImpSettings ({
  handleImportSettings
}) {
  const [modalProps, setModalProps] = useState(
    {
      btnText: '',
      title: 'Error!!!',
      content: '',
      showButton: false
    }
  )

  const appModal = useRef(null)
  const readJSONFile = (file) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (event) {
      const json = event.target.result
      const resp = parseJSON(json)
      if (resp.err === null) {
        // verify if the json file has the correct structure
        if (!objectPropertiesCompare(IMPORT_SETTINGS, resp.data)) {
          if (appModal.current) {
            setModalProps({
              btnText: '',
              title: 'Error!!',
              showButton: false,
              content: 'The json file hasn\'t the correct structure, please review that all properties exists and the data types are the right ones.'
            })
            appModal.current.handleModalOpen()
          }
          return
        }
        // if everything is ok load the settings
        handleImportSettings(resp.data)

        return
      }

      // if there was an error reading the json file
      if (appModal.current) {
        setModalProps({
          btnText: '',
          title: 'Error!!',
          content: resp.err,
          showButton: false
        })
        appModal.current.handleModalOpen()
      }
    }
    reader.onerror = function () {
      setModalProps({
        btnText: '',
        title: 'Error!!',
        content: 'Error reading the json file',
        showButton: false
      })
      appModal.current.handleModalOpen()
    }
  }

  const handleSettingsFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = _ => {
      const files = Array.from(input.files)
      if (files.length > 0) {
        const file = files[0]
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          readJSONFile(file)
        } else {
          if (appModal.current) {
            setModalProps({
              btnText: '',
              title: 'Error!!',
              content: 'Please select a valid JSON file.',
              showButton: false
            })
            appModal.current.handleModalOpen()
          }
        }
      }
    }
    input.click()
  }

  return (
    <>
      <Modal
        ref={appModal}
        btnText={modalProps.btnText}
        title={modalProps.title}
        content={modalProps.content}
      />
      <button className="btn" onClick={handleSettingsFile}>
        Import Settings
        <IconContext.Provider value={{ className: 'text-xl' }}>
          <FaFileImport />
        </IconContext.Provider>
      </button>
    </>
  )
}

DiffImpSettings.propTypes = {
  handleImportSettings: PropTypes.func.isRequired
}

export default DiffImpSettings
