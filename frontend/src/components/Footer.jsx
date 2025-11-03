import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#fafafa] border-t-[1px] border-t-[#eee] px-1 py-1.25 text-center" role="contentinfo">
      <div className="max-w-screen-lg mx-auto flex flex-col items-center gap-[4px]">
        <p>Food Order • Built with ❤️</p>
        <small>© {new Date().getFullYear()} Food Order</small>
      </div>
    </footer>
  )
}

export default Footer