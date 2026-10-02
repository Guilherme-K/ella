import logo from '../assets/Logo.png'

export default function Brand({ className = 'h-10 w-10', label = false }) {
  return <img className={className} src={logo} alt={label ? 'ELLA' : ''} />
}
