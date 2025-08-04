import React from 'react';

// Image assets (these would normally be replaced with actual asset URLs or local files)
const img = "http://localhost:3845/assets/7181269824e6bd9146fd80df198254be86bbcbf8.svg";
const img1 = "http://localhost:3845/assets/98ccedbc1cd2b0bb826c2850f493ac6c9668ce1a.svg";
const imgVector = "http://localhost:3845/assets/9570d61ce5db8864978f3c1b64e3822788126a5b.svg";
const imgAvgPace = "http://localhost:3845/assets/7909113726c439c2792166d046af2de8625b3f8b.svg";
const imgNavbarIcons = "http://localhost:3845/assets/0bec49e6605ce9cbdb5605152da4cdc6e4cda194.svg";
const img2 = "http://localhost:3845/assets/0ba626780ab810215bcdc02c112f237a892453ff.svg";
const img3 = "http://localhost:3845/assets/4386567ac095c6ff69585301229ca8824ca38a19.svg";
const imgIconM = "http://localhost:3845/assets/bd8c2a7d88cfd2923db09095c8ddda23cfc4636a.svg";
const img4 = "http://localhost:3845/assets/01259c9e0381b19b29f38be0bc90b840ffd9d76d.svg";
const img5 = "http://localhost:3845/assets/d40e3e8dfde70288ceaebb93fc4768ed0d203615.svg";

interface ActionButtonsProps {
    active?: 'off' | 'on';
    hover?: 'off' | 'on';
}

function ActionButtons({ active = "off", hover = "off" }: ActionButtonsProps) {
    return (
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative size-full" data-name="Active=off, Hover=off" id="node-3042_34714">
            <div className="relative shrink-0 size-6" data-name="Action icons" id="node-3042_34710">
                <div className="absolute bottom-[8.33%] left-[8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-1.95px] mask-size-[24px_24px] right-[8.33%] top-[8.13%]" data-name="notifications_active" id="node-I3042_34710-3042_34698" style={{ maskImage: `url('${img}')` }}>
                    <img alt="" className="block max-w-none size-full" src={img1}/>
                </div>
            </div>
        </div>
    );
}

function Dropdown() {
    return (
        <div className="relative size-full" data-name="Dropdown" id="node-2720_25592">
            <div className="absolute bottom-[39.58%] left-[29.17%] right-[29.17%] top-[39.58%]" data-name="Vector" id="node-2720_25593">
                <img alt="" className="block max-w-none size-full" src={imgVector}/>
            </div>
        </div>
    );
}

interface PipelineStatusProps {
    type?: 'Type6' | 'Type3';
}

function PipelineStatus({ type = "Type6" }: PipelineStatusProps) {
    if (type === 'Type3') {
        return (
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative size-full" data-name="Type=Type3" id="node-3042_42701">
                <div className="bg-[#4e7ac2] box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative rounded-[17px] shrink-0 size-5" id="node-3042_42716">
                    <div className="relative shrink-0 size-4" data-name="avg_pace" id="node-3042_42712">
                        <img alt="" className="block max-w-none size-full" src={imgAvgPace}/>
                    </div>
                </div>
                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[16px] text-left text-nowrap text-slate-900 tracking-[0.15px]" id="node-3042_42705" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="adjustLetterSpacing block leading-[1.57] whitespace-pre">Usage Monitor</p>
                </div>
            </div>
        );
    }
    return (
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative size-full" data-name="Type=Type6" id="node-2905_36008">
            <div className="relative shrink-0 size-5" data-name="Navbar Icons" id="node-3042_42697">
                <img alt="" className="block max-w-none size-full" src={imgNavbarIcons}/>
            </div>
            <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[16px] text-left text-nowrap text-slate-900 tracking-[0.15px]" id="node-2905_36010" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="adjustLetterSpacing block leading-[1.57] whitespace-pre">Pipelines</p>
            </div>
        </div>
    );
}

interface NotificationConfigurationProps {
    type?: 'Default' | 'Open' | 'Option 2' | 'Hover' | 'Presaved';
}

function NotificationConfiguration({ type = "Default" }: NotificationConfigurationProps) {
    if (type === 'Hover') {
        return (
            <button className="bg-[#ffffff] box-border content-stretch cursor-pointer flex flex-row items-center justify-between px-4 py-0 relative rounded size-full" data-name="Type=Hover" id="node-4405_14360">
                <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded"/>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0" data-name="Switch New" id="node-4405_14361">
                    <div className="h-6 relative shrink-0 w-10" data-name="Switch" id="node-I4405_14361-8_8269">
                        <div className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 opacity-50 p-[7px] rounded-[10px] top-0" data-name="Slide" id="node-I4405_14361-8_8270">
                            <div className="bg-[#1976d2] h-2.5 rounded-[10px] shrink-0 w-[26px]" data-name="Slide" id="node-I4405_14361-8_8271"/>
                        </div>
                        <div className="absolute right-0 size-6 top-0" data-name="Knob" id="node-I4405_14361-8_8272">
                            <div className="absolute bottom-[-4.17%] left-0 right-0 top-0">
                                <img alt="" className="block max-w-none size-full" src={img2}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-[135px]" data-name="Pipeline Status" id="node-4405_14362">
                    <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-nowrap text-slate-900 tracking-[0.25px]" id="node-I4405_14362-2905_36010" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">For each occurrence</p>
                    </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-[135px]" data-name="Pipeline Status" id="node-4405_14363">
                    <PipelineStatus />
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0" data-name="Avatar - Light mode" id="node-4405_14364">
                    <div className="bg-slate-400 box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-0 relative rounded-[64px] shrink-0 size-7" data-name=".Avatar" id="node-I4405_14364-2075_1387">
                        <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow h-full justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-slate-50 tracking-[0.25px]" id="node-I4405_14353-2075_1388" style={{ fontVariationSettings: "'wdth' 100" }}>
                            <p className="block leading-[1.43]"></p>
                        </div>
                    </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0" data-name="Notification icons" id="node-4405_14365">
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative shrink-0" data-name="Action buttons" id="node-4405_14366">
                        <ActionButtons />
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative shrink-0" data-name="Action buttons" id="node-4405_14367">
                        <ActionButtons />
                    </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0" id="node-4405_14368">
                    <div className="relative rounded shrink-0 w-[109px]" data-name="Button with Icon - Light Mode" id="node-4405_14369">
                        <div className="box-border content-stretch flex flex-row items-center justify-end overflow-clip p-0 relative w-[109px]">
                            <div className="basis-0 box-border content-stretch flex flex-col grow items-center justify-center min-h-px min-w-px overflow-clip px-3 py-1.5 relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="<Button>" id="node-I4405_14369-828_47333">
                                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-[99px]" data-name="Base" id="node-I4405_14369-828_47334">
                                    <div className="basis-0 font-['Roboto:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#1976d2] text-[14px] text-center tracking-[0.25px]" id="node-I4405_14358-828_47336" style={{ fontVariationSettings: "'wdth' 100" }}>
                                        <p className="block leading-[1.43]">Edit</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center self-stretch">
                                <div className="flex h-full items-center justify-center relative shrink-0" style={{ "--transform-inner-width": "32", "--transform-inner-height": "32.015625", width: "calc(1px * ((var(--transform-inner-height) * 1) + (var(--transform-inner-width) * 0)))" } as React.CSSProperties}>
                                    <div className="flex-none h-full rotate-[270deg]">
                                        <div className="h-full relative w-8" data-name="Vertical" id="node-I4405_14369-828_47338">
                                            <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(163, 200, 237, 1)" } as React.CSSProperties}>
                                                <img alt="" className="block max-w-none size-full" src={img3}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center self-stretch">
                                <div className="box-border content-stretch flex flex-col h-full items-center justify-center overflow-clip p-[6px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-name="<Button>" id="node-I4405_14369-828_47339">
                                    <div className="overflow-clip relative shrink-0 size-5" data-name="Right Icon L" id="node-I4405_14369-3287_15835">
                                        <Dropdown />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div aria-hidden="true" className="absolute border border-[#a3c8ed] border-solid inset-0 pointer-events-none rounded"/>
                    </div>
                    <div className="flex items-center justify-center relative shrink-0">
                        <div className="flex-none rotate-[180deg]">
                            <div className="overflow-clip relative size-6" data-name="Icon M" id="node-4405_14370">
                                <img alt="" className="block max-w-none size-full" src={imgIconM}/>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        );
    }

    if (type === 'Open') {
        return (
            <button className="bg-[#ffffff] box-border content-stretch cursor-pointer flex flex-col gap-2 items-start justify-start pb-2 pt-0 px-0 relative rounded size-full" data-name="Type=Open" id="node-4405_14398">
                <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded"/>
                <div className="box-border content-stretch flex flex-row h-10 items-center justify-between px-4 py-0 relative rounded shrink-0 w-full" data-name="Notification configuration" id="node-4405_14399">
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0" data-name="Switch New" id="node-4405_14400">
                        <div className="h-6 relative shrink-0 w-10" data-name="Switch" id="node-I4405_14400-8_8269">
                            <div className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 opacity-50 p-[7px] rounded-[10px] top-0" data-name="Slide" id="node-I4405_14400-8_8270">
                                <div className="bg-[#1976d2] h-2.5 rounded-[10px] shrink-0 w-[26px]" data-name="Slide" id="node-I4405_14400-8_8271"/>
                            </div>
                            <div className="absolute right-0 size-6 top-0" data-name="Knob" id="node-I4405_14400-8_8272">
                                <div className="absolute bottom-[-4.17%] left-0 right-0 top-0">
                                    <img alt="" className="block max-w-none size-full" src={img2}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-nowrap text-slate-900 tracking-[0.25px]" id="node-4405_14401" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">For each occurrence</p>
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-[135px]" data-name="Pipeline Status" id="node-4405_14402">
                        <PipelineStatus />
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0" data-name="Avatar - Light mode" id="node-4405_14403">
                        <div className="bg-slate-400 box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-0 relative rounded-[64px] shrink-0 size-7" data-name=".Avatar" id="node-I4405_14403-2075_1387">
                            <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow h-full justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-slate-50 tracking-[0.25px]" id="node-I4405_14353-2075_1388" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="block leading-[1.43]">TM</p>
                            </div>
                        </div>
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0" data-name="Notification icons" id="node-4405_14404">
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative shrink-0" data-name="Action buttons" id="node-4405_14405">
                            <ActionButtons />
                        </div>
                        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative shrink-0" data-name="Action buttons" id="node-4405_14406">
                            <ActionButtons />
                        </div>
                    </div>
                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0" id="node-4405_14407">
                        <div className="relative rounded shrink-0 w-[109px]" data-name="Button with Icon - Light Mode" id="node-4405_14408">
                            <div className="box-border content-stretch flex flex-row items-center justify-end overflow-clip p-0 relative w-[109px]">
                                <div className="basis-0 box-border content-stretch flex flex-col grow items-center justify-center min-h-px min-w-px overflow-clip px-3 py-1.5 relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="<Button>" id="node-I4405_14408-828_47333">
                                    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-[99px]" data-name="Base" id="node-I4405_14408-828_47334">
                                        <div className="basis-0 font-['Roboto:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#1976d2] text-[14px] text-center tracking-[0.25px]" id="node-I4405_14358-828_47336" style={{ fontVariationSettings: "'wdth' 100" }}>
                                            <p className="block leading-[1.43]">Edit</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center self-stretch">
                                    <div className="flex h-full items-center justify-center relative shrink-0" style={{ "--transform-inner-width": "32", "--transform-inner-height": "32.015625", width: "calc(1px * ((var(--transform-inner-height) * 1) + (var(--transform-inner-width) * 0)))" } as React.CSSProperties}>
                                        <div className="flex-none h-full rotate-[270deg]">
                                            <div className="h-full relative w-8" data-name="Vertical" id="node-I4405_14408-828_47338">
                                                <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(163, 200, 237, 1)" } as React.CSSProperties}>
                                                    <img alt="" className="block max-w-none size-full" src={img3}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center self-stretch">
                                    <div className="box-border content-stretch flex flex-col h-full items-center justify-center overflow-clip p-[6px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-name="<Button>" id="node-I4405_14408-828_47339">
                                        <div className="overflow-clip relative shrink-0 size-5" data-name="Right Icon L" id="node-I4405_14408-3287_15835">
                                            <Dropdown />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div aria-hidden="true" className="absolute border border-[#a3c8ed] border-solid inset-0 pointer-events-none rounded"/>
                        </div>
                        <div className="overflow-clip relative shrink-0 size-6" data-name="Icon M" id="node-4405_14409">
                            <img alt="" className="block max-w-none size-full" src={imgIconM}/>
                        </div>
                    </div>
                </div>
                <div className="box-border content-stretch flex flex-row items-end justify-between px-4 py-0 relative shrink-0 w-full" data-name="Notification details" id="node-4405_14410">
                    <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0" data-name="Notification methods" id="node-4405_14411">
                        <div className="box-border content-stretch flex flex-row font-['Roboto:Regular',_sans-serif] font-normal gap-4 items-baseline justify-start leading-[0] p-0 relative shrink-0 text-left text-nowrap" id="node-4405_14412">
                            <div className="relative shrink-0 text-[14px] text-slate-600 tracking-[0.25px]" id="node-4405_14413" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43] text-nowrap whitespace-pre">Notification ID</p>
                            </div>
                            <div className="relative shrink-0 text-[16px] text-slate-900 tracking-[0.15px]" id="node-4405_14414" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.57] text-nowrap whitespace-pre">ABCD1234</p>
                            </div>
                        </div>
                        <div className="box-border content-stretch flex flex-row gap-4 items-baseline justify-start p-0 relative shrink-0" id="node-4405_14415">
                            <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-slate-600 tracking-[0.25px] w-[93px]" id="node-4405_14416" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43]">Trigger Event</p>
                            </div>
                            <div className="box-border content-stretch flex flex-row gap-1 h-[18px] items-center justify-start px-0.5 py-1 relative rounded-[28px] shrink-0" data-name="Chip - Light Mode" id="node-4405_14417">
                                <div aria-hidden="true" className="absolute border border-[#4e7ac2] border-solid inset-[-0.5px] pointer-events-none rounded-[28.5px]"/>
                                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1976d2] text-[12px] text-left text-nowrap tracking-[0.4px]" id="node-I4405_14417-4116_14043" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">Failure</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0" data-name="Notification methods" id="node-4405_14418">
                        <div className="box-border content-stretch flex flex-row gap-[31px] items-baseline justify-start p-0 relative shrink-0" id="node-4405_14419">
                            <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-nowrap text-slate-600 tracking-[0.25px]" id="node-4405_14420" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">Source</p>
                            </div>
                            <div className="box-border content-stretch flex flex-row gap-1 h-[18px] items-center justify-start px-2 py-1 relative rounded-[28px] shrink-0" data-name="Chip - Light Mode" id="node-4405_14421">
                                <div aria-hidden="true" className="absolute border border-[#4e7ac2] border-solid inset-[-0.5px] pointer-events-none rounded-[28.5px]"/>
                                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1976d2] text-[12px] text-left text-nowrap tracking-[0.4px]" id="node-I4405_14421-4116_14043" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">Pipelines</p>
                                </div>
                            </div>
                        </div>
                        <div className="box-border content-stretch flex flex-row font-['Roboto:Regular',_sans-serif] font-normal gap-4 items-baseline justify-start leading-[0] p-0 relative shrink-0 text-left" id="node-4405_14422">
                            <div className="relative shrink-0 text-[14px] text-slate-600 tracking-[0.25px] w-[60px]" id="node-4405_14423" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43]">Trigger</p>
                            </div>
                            <div className="relative shrink-0 text-[16px] text-nowrap text-slate-900 tracking-[0.15px]" id="node-4405_14424" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.57] whitespace-pre">custom_pipeline_1 failure</p>
                            </div>
                        </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0" data-name="Notification methods" id="node-4405_14425">
                        <div className="box-border content-stretch flex flex-row gap-4 items-baseline justify-start p-0 relative shrink-0" id="node-4405_14426">
                            <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-slate-600 tracking-[0.25px] w-[60px]" id="node-4405_14427" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43]">Email</p>
                            </div>
                            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0" id="node-4405_14428">
                                <div className="box-border content-stretch flex flex-row gap-1 h-6 items-center justify-start p-[4px] relative rounded-[28px] shrink-0" data-name="Chip - Light Mode" id="node-4405_14429">
                                    <div aria-hidden="true" className="absolute border border-[#a3c8ed] border-solid inset-[-0.5px] pointer-events-none rounded-[28.5px]"/>
                                    <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#145ea8] text-[14px] text-left text-nowrap tracking-[0.25px]" id="node-I4405_14429-4116_14235" style={{ fontVariationSettings: "'wdth' 100" }}>
                                        <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">Dave Gordon</p>
                                    </div>
                                </div>
                                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1976d2] text-[14px] text-left text-nowrap tracking-[0.25px]" id="node-4405_14430" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">+5</p>
                                </div>
                            </div>
                        </div>
                        <div className="box-border content-stretch flex flex-row gap-4 items-baseline justify-start p-0 relative shrink-0" id="node-4405_14431">
                            <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-slate-600 tracking-[0.25px] w-[60px]" id="node-4405_14432" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43]">Platform</p>
                            </div>
                            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0" id="node-4405_14433">
                                <div className="box-border content-stretch flex flex-row gap-1 h-6 items-center justify-start p-[4px] relative rounded-[28px] shrink-0" data-name="Chip - Light Mode" id="node-4405_14434">
                                    <div aria-hidden="true" className="absolute border border-[#a3c8ed] border-solid inset-[-0.5px] pointer-events-none rounded-[28.5px]"/>
                                    <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#145ea8] text-[14px] text-left text-nowrap tracking-[0.25px]" id="node-I4405_14434-4116_14235" style={{ fontVariationSettings: "'wdth' 100" }}>
                                        <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">Dave Gordon</p>
                                    </div>
                                </div>
                                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#1976d2] text-[14px] text-left text-nowrap tracking-[0.25px]" id="node-4405_14435" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">+5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0" data-name="Notification methods" id="node-4405_14436">
                        <div className="box-border content-stretch flex flex-row font-['Roboto:Regular',_sans-serif] font-normal gap-4 items-baseline justify-start leading-[0] p-0 relative shrink-0 text-left" id="node-4405_14437">
                            <div className="relative shrink-0 text-[14px] text-slate-600 tracking-[0.25px] w-[57px]" id="node-4405_14438" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43]">Created</p>
                            </div>
                            <div className="relative shrink-0 text-[16px] text-nowrap text-slate-900 tracking-[0.15px]" id="node-4405_14439" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.57] whitespace-pre">2025/03/05 21:45:32</p>
                            </div>
                        </div>
                        <div className="box-border content-stretch flex flex-row font-['Roboto:Regular',_sans-serif] font-normal gap-4 items-baseline justify-start leading-[0] p-0 relative shrink-0 text-left text-nowrap" id="node-4405_14440">
                            <div className="relative shrink-0 text-[14px] text-slate-600 tracking-[0.25px]" id="node-4405_14441" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.43] text-nowrap whitespace-pre">Modified</p>
                            </div>
                            <div className="relative shrink-0 text-[16px] text-slate-900 tracking-[0.15px]" id="node-4405_14442" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="adjustLetterSpacing block leading-[1.57] text-nowrap whitespace-pre">2025/03/05 21:45:32</p>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        );
    }

    // Default state - collapsed view
    return (
        <button className="bg-slate-50 box-border content-stretch cursor-pointer flex flex-row items-center justify-between px-4 py-0 relative rounded-[3px] size-full h-10" data-name="Type=Default" id="node-4405_14349">
            <div aria-hidden="true" className="absolute border border-slate-200 border-solid inset-0 pointer-events-none rounded-[3px]"/>
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0" data-name="Switch New" id="node-4405_14350">
                <div className="h-6 relative shrink-0 w-10" data-name="Switch" id="node-I4405_14350-8_8269">
                    <div className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 opacity-50 p-[7px] rounded-[10px] top-0" data-name="Slide" id="node-I4405_14350-8_8270">
                        <div className="bg-[#1976d2] h-2.5 rounded-[10px] shrink-0 w-[26px]" data-name="Slide" id="node-I4405_14350-8_8271"/>
                    </div>
                    <div className="absolute right-0 size-6 top-0" data-name="Knob" id="node-I4405_14350-8_8272">
                        <div className="absolute bottom-[-4.17%] left-0 right-0 top-0">
                            <img alt="" className="block max-w-none size-full" src={img2}/>
                        </div>
                    </div>
                </div>
                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[16px] text-left text-nowrap text-slate-900 tracking-[0.15px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="adjustLetterSpacing block leading-[1.5] whitespace-pre">Artifact with trigger type</p>
                </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-[135px]" data-name="Pipeline Status" id="node-4405_14351">
                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-nowrap text-slate-900 tracking-[0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="adjustLetterSpacing block leading-[1.43] whitespace-pre">For each occurrence</p>
                </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-[135px]" data-name="Pipeline Status" id="node-4405_14352">
                <div className="relative shrink-0 size-5" data-name="Navbar Icons">
                    <img alt="" className="block max-w-none size-full" src={imgNavbarIcons}/>
                </div>
                <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[16px] text-left text-nowrap text-slate-600 tracking-[0.15px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="adjustLetterSpacing block leading-[1.57] whitespace-pre">Pipelines</p>
                </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0" data-name="Avatar - Light mode" id="node-4405_14353">
                <div className="bg-slate-400 box-border content-stretch flex flex-row gap-2.5 items-center justify-center overflow-clip p-0 relative rounded-[64px] shrink-0 size-7" data-name=".Avatar">
                    <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow h-full justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[14px] text-center text-slate-50 tracking-[0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="block leading-[1.43]">TM</p>
                    </div>
                </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0" data-name="Notification icons" id="node-4405_14354">
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative shrink-0" data-name="Action buttons" id="node-4405_14355">
                    <ActionButtons />
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[4px] relative shrink-0" data-name="Action buttons" id="node-4405_14356">
                    <ActionButtons />
                </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0" id="node-4405_14357">
                <div className="relative rounded shrink-0 w-[109px]" data-name="Button with Icon - Light Mode" id="node-4405_14358">
                    <div className="box-border content-stretch flex flex-row items-center justify-end overflow-clip p-0 relative w-[109px]">
                        <div className="basis-0 box-border content-stretch flex flex-col grow items-center justify-center min-h-px min-w-px overflow-clip px-3 py-1.5 relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="<Button>">
                            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-[99px]" data-name="Base">
                                <div className="basis-0 font-['Roboto:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#1976d2] text-[14px] text-center tracking-[0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    <p className="block leading-[1.43]">Edit</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center self-stretch">
                            <div className="flex h-full items-center justify-center relative shrink-0" style={{ "--transform-inner-width": "32", "--transform-inner-height": "32.015625", width: "calc(1px * ((var(--transform-inner-height) * 1) + (var(--transform-inner-width) * 0)))" } as React.CSSProperties}>
                                <div className="flex-none h-full rotate-[270deg]">
                                    <div className="h-full relative w-8" data-name="Vertical">
                                        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(163, 200, 237, 1)" } as React.CSSProperties}>
                                            <img alt="" className="block max-w-none size-full" src={img3}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center self-stretch">
                            <div className="box-border content-stretch cursor-pointer flex flex-col h-full items-center justify-center overflow-clip p-[6px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-name="<Button>" role="button" tabIndex={0}>
                                <div className="overflow-clip relative shrink-0 size-5" data-name="Right Icon L">
                                    <Dropdown />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#a3c8ed] border-solid inset-0 pointer-events-none rounded"/>
                </div>
                <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-[180deg]">
                        <div className="overflow-clip relative size-6" data-name="Icon M">
                            <img alt="" className="block max-w-none size-full" src={imgIconM}/>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

// Main component that demonstrates all states
export default function NotificationConfigurationDemo() {
    const [selectedType, setSelectedType] = React.useState<'Default' | 'Open' | 'Option 2' | 'Hover' | 'Presaved'>('Default');

    return (
        <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Notification Configuration Component</h1>
                <p className="text-gray-600 mb-6">Generated from Figma using MCP (Model Context Protocol)</p>
                
                <div className="flex gap-2 mb-6">
                    {(['Default', 'Open', 'Hover'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded ${
                                selectedType === type 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Current State: {selectedType}</h2>
                <div className="w-full" style={{ height: selectedType === 'Open' ? 'auto' : '40px' }}>
                    <NotificationConfiguration type={selectedType} />
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Component Features</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Default State:</strong> Collapsed view with toggle switch, pipeline status, and action buttons</li>
                    <li><strong>Open State:</strong> Expanded view showing detailed notification configuration including ID, trigger events, source, email recipients, platform users, and timestamps</li>
                    <li><strong>Hover State:</strong> Interactive hover effects with visual feedback</li>
                    <li><strong>Interactive Elements:</strong> Toggle switches, action buttons, avatars, and dropdown menus</li>
                    <li><strong>Design System:</strong> Uses Roboto font family with consistent spacing, colors, and typography</li>
                    <li><strong>Responsive Design:</strong> Built with Tailwind CSS for consistent styling and responsiveness</li>
                </ul>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Technical Implementation</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Framework:</strong> React with TypeScript</li>
                    <li><strong>Styling:</strong> Tailwind CSS with custom design tokens</li>
                    <li><strong>Assets:</strong> SVG icons and images served from localhost</li>
                    <li><strong>Component Architecture:</strong> Modular with reusable sub-components (ActionButtons, Dropdown, PipelineStatus)</li>
                    <li><strong>State Management:</strong> Props-based state control for different component variants</li>
                </ul>
            </div>
        </div>
    );
}