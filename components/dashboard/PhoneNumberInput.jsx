'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import 'react-phone-number-input/style.css';
import countryNames from 'react-phone-number-input/locale/en.json';
import {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input/input';

// Country Select Dropdown Component
const CountrySelect = ({ selectedCountry, onSelectCountry, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const countryOptions = useMemo(() => {
    return getCountries().map((code) => ({
      code,
      name: countryNames[code] || code,
      dialCode: `+${getCountryCallingCode(code)}`,
    }));
  }, []);

  const filteredCountries = countryOptions.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  return (
    <div
      className="absolute bg-white-1 z-10 w-[214px] mt-1
      border rounded-md
     shadow-lg"
    >
      <div className="p-2 border-b">
        <div className="relative ">
          <input
            type="text"
            placeholder="Search"
            className="w-full text-[13px] pl-8 pr-2 py-1 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size="16px"
            className="absolute  left-2 top-1/2 
          transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div className="max-h-40 overflow-y-auto ">
        {filteredCountries.map((country) => (
          <div
            key={country.code}
            className="flex items-center text-[13px] p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onSelectCountry(country);
              onClose();
            }}
          >
            <span className="mr-2 font-normal text-[13px]">{country.code}</span>
            <span className="flex-grow text-[13px]">{country.name}</span>
            <span className="ml-auto text-[13px]">{country.dialCode}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Phone Input Component
const PhoneNumberInput = () => {
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US',
    dialCode: '+1',
    name: 'United States',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setPhoneNumber(country.dialCode + ' ');
  };

  return (
    <div className="flex  items-start w-full ">
      <div className="relative  ">
        <div
          className="flex items-center border rounded-br-none rounded-tr-none
          rounded-md pl-1  bg-grey-2 py-[6px] border-r-0 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[14px] font-extrabold ">
            {selectedCountry.code}
          </span>
          <ChevronDown className="" />
        </div>
        {isOpen && (
          <CountrySelect
            selectedCountry={selectedCountry}
            onSelectCountry={handleCountryChange}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
      <input
        type="tel"
        placeholder="Mobile phone"
        className="flex-grow border-l-0 pl-2
        text-[14px] py-[7.5px] border rounded-md rounded-bl-none
         rounded-tl-none bg-transparent w-full"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
    </div>
  );
};

export default PhoneNumberInput;
