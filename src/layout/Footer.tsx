
const Footer = () => {
  const today = new Date()
  return (
    <footer>
      {today.getFullYear()} | Designed & coded by Daichi
  </footer>
  )
}

export default Footer