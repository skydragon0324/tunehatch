import React from "react";

export default function Footer() {
  return (
    <div className="bg-white flex flex-col md:flex-row min-w-full p-8 text-left leading-8">
      <ul className="md:flex md:space-x-8">
        <li>
          <a href="/">© 2024 TuneHatch Inc.</a>
        </li>
        <li>
          <a href="https://tunehatch.com/privacy">Privacy</a>
        </li>
        <li>
          <a href="mailto:info@tunehatch.com">Contact</a>
        </li>
        <li>
          <a href="https://tunehatch.com/refunds">Refunds</a>
        </li>
        <li>
          <a href="https://tunehatch.com/tos">Terms Of Service</a>
        </li>
      </ul>
    </div>
  );
}
