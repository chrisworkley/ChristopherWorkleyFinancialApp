const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
  return (
    <div className="header-box bg-primary text-white rounded-xl p-4 shadow-md">
      <h1 className="header-box-title">
        {title}
        {type === 'greeting' && (
          <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
            &nbsp;{user}
          </span>
        )}
      </h1>
      <div className="header-accent-bar mt-2" />
      <p className="header-box-subtext">{subtext}</p>
    </div>
  )
}

export default HeaderBox