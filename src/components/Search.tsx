import React from 'react'
import {Search as SearchIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';

const Search = () => {
  return (
    <form className="hidden">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-48 appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
  )
}

export default Search