import { Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <nav className="flex space-x-4 mb-4 md:mb-0">
            <Link href="#" className="text-sm text-gray-400 hover:text-teal-500">About</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-teal-500">Features</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-teal-500">Testimonials</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-teal-500">Contact</Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-teal-500">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-teal-500">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-teal-500">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-8">
          © 2023 Stock Management App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

