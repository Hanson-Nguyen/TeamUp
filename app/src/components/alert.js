import '../css/alerts/alerts.scss'

const AlertMessage = (props) => {
  const message = props.message
  const type = props.type

  const SimpleAlert = () => {
    return (
      <>
      <div id="alert_message" className={`alert-container ${type}`}>
        {message}
      </div>
      </>
    )
  }
  return <SimpleAlert />
}

export default AlertMessage
