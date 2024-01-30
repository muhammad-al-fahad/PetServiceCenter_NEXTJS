const Notification = ({msg, handleShadow, bgColor}) => {
    const transForm = {
        marginLeft: msg.title === 'Error' ? 270 : 253,
        background: 'none',
        border: 'none'
      }
   return(
    <div className={`toast show position-fixed text-light ${bgColor}`} style={{ top: '5px', right: '5px', zIndex: 9, minWidth: '300px'}}>
        <div className={`toast-header text-light ${bgColor}`}>
            <strong className="mr-auto text-light">{msg.title}</strong>
            <button type="button" className="ml-2 mb-1 close text-light" data-dismiss="toast" style={transForm}  onClick={handleShadow}> X </button>
        </div>
        <div className="toast-body">
            {msg.msg}
        </div>
    </div>
   )
}

export default Notification