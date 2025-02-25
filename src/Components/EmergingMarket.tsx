import React from "react";

export default function EmergingMarket(props: {
    cityName: string;
    cityContact?: string;
}){
    const cityName = (props.cityName.split(","))[0]
    return <>
        <div className="w-10/12 mx-auto bg-orange rounded p-4 pt-2 text-white">
            <h1 className="text-2xl font-black text-center m-2">It's nice to meet you, {cityName}.</h1>
            <p className="text-center">We think we're going to get along great. <br/>
            We are currently expanding into the {cityName} area. If you know a venue that you think would be a great fit, we'd love to hear about it.
            Reach out to <a className="underline" href="mailto:info@tunehatch.com">info@tunehatch.com</a> and let us know.
            
            <br/><br/>
            If you're a venue owner in {cityName} and you're interested in using TuneHatch to run simpler, more profitable shows today, <a className="underline" href="https://tunehatch.com/register">click here to get started</a>, or <a className="underline" target="_blank" rel="noreferrer" href="https://calendly.com/nathan-tunehatch/30min">click here to book a demo</a>.</p>
        </div>
    </>
}