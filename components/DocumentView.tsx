"use client";

import React from "react";
import { Copy, Check, ArrowUp, ArrowDown } from "lucide-react";
import { PRDData } from "@/types/prd";

interface DocumentViewProps {
  data: PRDData;
  printMode?: "full" | "agreement";
}


const SectionControls = ({ index, total, moveUp, moveDown }: { index: number, total: number, moveUp: (i: number) => void, moveDown: (i: number) => void }) => {
  const [copied, React_setCopied] = React.useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const section = btn.closest("section") || btn.closest(".section-container");
    if (section) {
      const clone = section.cloneNode(true) as HTMLElement;
      const btns = clone.querySelectorAll(".section-controls");
      btns.forEach((b) => b.remove());
      navigator.clipboard.writeText(clone.innerText.trim());
      React_setCopied(true);
      setTimeout(() => React_setCopied(false), 2000);
    }
  };
  return (
    <div className="section-controls no-print absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded z-10 flex flex-row items-center p-1 gap-1">
      <button onClick={() => moveUp(index)} className="p-1 hover:text-black dark:hover:text-white text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10 rounded" title="Move Up">
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => moveDown(index)} className="p-1 hover:text-black dark:hover:text-white text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10 rounded" title="Move Down">
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-3 bg-black/20 dark:bg-white/20 mx-0.5" />
      <button onClick={handleCopy} className="p-1 hover:text-black dark:hover:text-white text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10 rounded" title="Copy Section">
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
const getPriorityBadge = (p: string) => {
    switch (p.toLowerCase()) {
      case "high":
        return "bg-black dark:bg-white text-white dark:text-[#121212] border-black dark:border-white/30 font-bold";
      case "medium":
        return "bg-neutral-800 text-white dark:text-[#121212] border-neutral-800 font-semibold";
      case "low":
        return "bg-[#EFECE7] dark:bg-[#1E1E1E] text-[#1A1A1A] dark:text-[#F4F1EE] border-black dark:border-white/20 font-medium";
      default:
        return "bg-neutral-50 dark:bg-white/5 text-black/90 dark:text-white/90 border-black dark:border-white/10";
    }
  };

const sectionBlocks = [
  // {/* 1. PROJECT OVERVIEW */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-0">
      <section id="section-1" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>1. PROJECT OVERVIEW</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 01
            </span>
          </h2>

          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 mb-1.5">
              1.1 Project Description
            </h3>
            <p className="text-sm text-[#1A1A1A] dark:text-[#F4F1EE] leading-relaxed whitespace-pre-line bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10">
              {d.projectDescription ||
                "[Briefly describe what will be designed/developed, the business problem it solves, and its primary purpose.]"}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 mb-1.5">
              1.2 Project Objectives
            </h3>
            <p className="text-xs text-black/80 dark:text-white/80 mb-2">
              The primary objectives of this project are:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] pl-2">
              {d.projectObjectives.map((obj, idx) => (
                <li key={idx} className="leading-relaxed">
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 mb-2">
              1.3 Target Users
            </h3>
            <div className="space-y-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] pl-2 border-l-2 border-black dark:border-white/20">
              <p>
                <span className="font-bold text-black/90 dark:text-white/90 uppercase text-[10px] tracking-wider">
                  Primary Users:
                </span>{" "}
                {d.targetUsers.primary || "[User Type]"}
              </p>
              <p>
                <span className="font-bold text-black/90 dark:text-white/90 uppercase text-[10px] tracking-wider">
                  Secondary Users:
                </span>{" "}
                {d.targetUsers.secondary || "[User Type]"}
              </p>
              <p>
                <span className="font-bold text-black/90 dark:text-white/90 uppercase text-[10px] tracking-wider">
                  Admin Users:
                </span>{" "}
                {d.targetUsers.admin || "[Admin / Staff / Management]"}
              </p>
            </div>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 2. PROJECT SCOPE */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-1">
      <section id="section-2" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>2. PROJECT SCOPE</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 02
            </span>
          </h2>
          <p className="text-xs text-black/90 dark:text-white/90 mb-3 leading-relaxed">
            The project includes the design, development, testing, and
            deployment of the features specifically mentioned in this document.
          </p>

          <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 mb-2">
            Included Platforms
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.includedPlatforms.website}
                readOnly
                className="accent-black"
              />
              <span className="font-medium">Website</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.includedPlatforms.webApp}
                readOnly
                className="accent-black"
              />
              <span className="font-medium">Web Application</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.includedPlatforms.adminPanel}
                readOnly
                className="accent-black"
              />
              <span className="font-medium">Admin Panel</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.includedPlatforms.androidApp}
                readOnly
                className="accent-black"
              />
              <span className="font-medium">Android App</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.includedPlatforms.iosApp}
                readOnly
                className="accent-black"
              />
              <span className="font-medium">iOS App</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.includedPlatforms.apiBackend}
                readOnly
                className="accent-black"
              />
              <span className="font-medium">API / Backend</span>
            </label>
            {d.includedPlatforms.other && (
              <label className="flex items-center space-x-2 col-span-2">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="accent-black"
                />
                <span className="font-medium">
                  Other: {d.includedPlatforms.other}
                </span>
              </label>
            )}
          </div>
          <p className="text-[11px] text-black/70 dark:text-white/70 italic">
            Only checked and explicitly documented platforms are included.
          </p>
        </section>
    </React.Fragment>
  ),
  // {/* 3. FEATURES & FUNCTIONAL REQUIREMENTS */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-2">
      <section id="section-3"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>3. FEATURES &amp; FUNCTIONAL REQUIREMENTS</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 03
            </span>
          </h2>

          <div className="min-w-0 max-w-full overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-[#121212]">
                  <th className="p-2.5 font-bold uppercase tracking-wider w-16 sm:w-16">
                    ID
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider w-1/4 sm:w-1/4">
                    Feature
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider min-w-0">
                    Description
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider w-24 sm:w-24 text-center">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.features.map((f, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-[#2A2A2A] border-b border-black dark:border-white/10"
                        : "bg-neutral-50 dark:bg-white/5 border-b border-black dark:border-white/10"
                    }
                  >
                    <td className="p-2.5 font-mono font-bold text-black dark:text-white min-w-0">
                      {f.id}
                    </td>
                    <td className="p-2.5 font-bold text-[#1A1A1A] dark:text-[#F4F1EE] min-w-0">
                      {f.feature}
                    </td>
                    <td className="p-2.5 text-black/80 dark:text-white/80 leading-snug min-w-0">
                      {f.description}
                    </td>
                    <td className="p-2.5 text-center min-w-0">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold border ${getPriorityBadge(f.priority)}`}
                      >
                        {f.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-black/80 dark:text-white/80 space-y-1 italic">
            <span>
              Each feature will be implemented according to the behavior
              described and approved in this document.
            </span>
          </p>
        </section>
    </React.Fragment>
  ),
  // {/* 4. PAGES / SCREENS */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-3">
      <section id="section-4"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>4. PAGES / SCREENS</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 04
            </span>
          </h2>
          <p className="text-xs text-black/90 dark:text-white/90 mb-2">
            The project will contain the following agreed pages/screens:
          </p>

          <ol className="list-decimal list-inside grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            {d.pages.map((p, idx) => (
              <li
                key={idx}
                className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE]"
              >
                {p}
              </li>
            ))}
          </ol>

          <p className="text-[11px] text-black/70 dark:text-white/70 italic">
            Any additional page or major screen requested after approval may be
            treated as additional scope.
          </p>
        </section>
    </React.Fragment>
  ),
  // {/* 5. USER ROLES & PERMISSIONS */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-4">
      <section id="section-5"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>5. USER ROLES &amp; PERMISSIONS</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 05
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-50 dark:bg-white/5 p-3.5 border border-black dark:border-white/10">
              <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px] mb-1">
                Guest
              </h3>
              <p className="text-black/80 dark:text-white/80">
                {d.userRoles.guest || "[Define permissions]"}
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-white/5 p-3.5 border border-black dark:border-white/10">
              <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px] mb-1">
                Registered User
              </h3>
              <p className="text-black/80 dark:text-white/80">
                {d.userRoles.registeredUser || "[Define permissions]"}
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-white/5 p-3.5 border border-black dark:border-white/10">
              <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px] mb-1">
                Admin
              </h3>
              <p className="text-black/80 dark:text-white/80">
                {d.userRoles.admin || "[Define permissions]"}
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-white/5 p-3.5 border border-black dark:border-white/10">
              <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px] mb-1">
                Super Admin
              </h3>
              <p className="text-black/80 dark:text-white/80">
                {d.userRoles.superAdmin || "[Define permissions]"}
              </p>
            </div>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 6. USER FLOWS */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-5">
      <section id="section-6"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>6. USER FLOWS</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 06
            </span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-black/90 dark:text-white/90 uppercase tracking-wider text-[10px] mb-1">
                Registration Flow
              </h3>
              <div className="bg-[#1A1A1A] text-[#F4F1EE] p-3 font-mono text-xs border border-black dark:border-white/30">
                {d.userFlows.registration}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-black/90 dark:text-white/90 uppercase tracking-wider text-[10px] mb-1">
                Primary Product Flow
              </h3>
              <div className="bg-[#1A1A1A] text-[#F4F1EE] p-3 font-mono text-xs border border-black dark:border-white/30">
                {d.userFlows.primaryProductFlow}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-black/90 dark:text-white/90 uppercase tracking-wider text-[10px] mb-1">
                Admin Flow
              </h3>
              <div className="bg-[#1A1A1A] text-[#F4F1EE] p-3 font-mono text-xs border border-black dark:border-white/30">
                {d.userFlows.adminFlow}
              </div>
            </div>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 7. UI/UX & DESIGN */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-6">
      <section id="section-7"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>7. UI/UX &amp; DESIGN</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 07
            </span>
          </h2>

          <div className="bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 text-xs mb-4 space-y-1.5">
            <p>
              <span className="font-bold uppercase text-[10px] text-black/80 dark:text-white/80">
                Style:
              </span>{" "}
              {d.design.style}
            </p>
            <p>
              <span className="font-bold uppercase text-[10px] text-black/80 dark:text-white/80">
                Primary Color:
              </span>{" "}
              {d.design.primaryColor}
            </p>
            <p>
              <span className="font-bold uppercase text-[10px] text-black/80 dark:text-white/80">
                Secondary Color:
              </span>{" "}
              {d.design.secondaryColor}
            </p>
            <p>
              <span className="font-bold uppercase text-[10px] text-black/80 dark:text-white/80">
                Typography:
              </span>{" "}
              {d.design.typography}
            </p>
            <p>
              <span className="font-bold uppercase text-[10px] text-black/80 dark:text-white/80">
                References:
              </span>{" "}
              {d.design.referenceWebsites}
            </p>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 mb-2">
            Client-Provided Assets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-3 border border-black dark:border-white/10 mb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.design.clientAssets.logo}
                readOnly
                className="accent-black"
              />
              <span>Logo</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.design.clientAssets.brandGuidelines}
                readOnly
                className="accent-black"
              />
              <span>Brand guidelines</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.design.clientAssets.finalTextContent}
                readOnly
                className="accent-black"
              />
              <span>Final text/content</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.design.clientAssets.productInfo}
                readOnly
                className="accent-black"
              />
              <span>Product info</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.design.clientAssets.imagesVideos}
                readOnly
                className="accent-black"
              />
              <span>Images/videos</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={d.design.clientAssets.legalPolicies}
                readOnly
                className="accent-black"
              />
              <span>Legal policies</span>
            </label>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 8. TECHNICAL ARCHITECTURE */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-7">
      <section id="section-8"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>8. TECHNICAL ARCHITECTURE</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 08
            </span>
          </h2>

          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-[#121212]">
                  <th className="p-2.5 font-bold uppercase tracking-wider w-1/3">
                    Component
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider">
                    Technology
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Frontend
                  </td>
                  <td className="p-2.5">{d.techStack.frontend}</td>
                </tr>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Backend
                  </td>
                  <td className="p-2.5">{d.techStack.backend}</td>
                </tr>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Database
                  </td>
                  <td className="p-2.5">{d.techStack.database}</td>
                </tr>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Authentication
                  </td>
                  <td className="p-2.5">{d.techStack.authentication}</td>
                </tr>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Storage
                  </td>
                  <td className="p-2.5">{d.techStack.storage}</td>
                </tr>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Hosting
                  </td>
                  <td className="p-2.5">{d.techStack.hosting}</td>
                </tr>
                <tr className="border-b border-black dark:border-white/10">
                  <td className="p-2.5 font-bold uppercase text-[10px] bg-neutral-50 dark:bg-white/5">
                    Analytics
                  </td>
                  <td className="p-2.5">{d.techStack.analytics}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 9. THIRD-PARTY INTEGRATIONS */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-8">
      <section id="section-9"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>9. THIRD-PARTY INTEGRATIONS</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 09
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            {d.thirdPartyIntegrations.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </section>
    </React.Fragment>
  ),
  // {/* 10. SECURITY */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-9">
      <section id="section-10"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>10. SECURITY PRACTICES</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 10
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            {d.securityPractices.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </section>
    </React.Fragment>
  ),
  // {/* 11. PERFORMANCE */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-10">
      <section id="section-11"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>11. PERFORMANCE OPTIMIZATION</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 11
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            {d.performanceOptimizations.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </section>
    </React.Fragment>
  ),
  // {/* 12. SEO */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-11">
      <section id="section-12"
          className={`relative group section-container ${prdSectionClass}`}
        >
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>12. SEO FEATURES</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 12
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            {d.seoFeatures.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </section>
    </React.Fragment>
  ),
  // {/* 13. DELIVERABLES */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-12">
      <section id="section-13" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>13. DELIVERABLES</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 13
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10 mb-2">
            {d.deliverables.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
    </React.Fragment>
  ),
  // {/* 14. PROJECT TIMELINE */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-13">
      <section id="section-14" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>14. PROJECT TIMELINE &amp; PHASES</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 14
            </span>
          </h2>

          <div className="overflow-x-auto mb-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-[#121212]">
                  <th className="p-2.5 font-bold uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="p-2.5 font-bold uppercase tracking-wider text-right w-44">
                    Estimated Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.timelinePhases.map((t, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-white dark:bg-[#2A2A2A] border-b border-black dark:border-white/10"
                        : "bg-neutral-50 dark:bg-white/5 border-b border-black dark:border-white/10"
                    }
                  >
                    <td className="p-2.5 font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">
                      {t.phase}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-black dark:text-white">
                      {t.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm font-bold text-[#1A1A1A] dark:text-[#F4F1EE] mb-2">
            Estimated Total:{" "}
            <span className="font-mono underline">{d.estimatedTimeline}</span>
          </p>
        </section>
    </React.Fragment>
  ),
  // {/* 15. PAYMENT TERMS */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-14">
      <section id="section-15" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>15. PAYMENT TERMS &amp; MILESTONES</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 15
            </span>
          </h2>
          <p className="text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] mb-4">
            Total Agreed Valuation:{" "}
            <span className="font-mono text-lg">
              {d.currencySymbol}
              {d.projectCost}
            </span>
          </p>

          <div className="space-y-3 mb-3">
            {d.paymentStructure.map((p, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 dark:bg-white/5 p-4 border-l-4 border-black dark:border-white/30 border border-black dark:border-white/10 text-xs"
              >
                <span className="font-black uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F1EE] block">
                  {p.percentage} — {p.milestone}
                </span>
                <p className="text-black/80 dark:text-white/80 mt-1">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 16. REVISION POLICY */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-15">
      <section id="section-16" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>16. REVISION POLICY</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 16
            </span>
          </h2>
          <div className="text-xs text-[#1A1A1A] dark:text-[#F4F1EE] space-y-2 mb-3 bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10">
            <p>
              <span className="font-bold uppercase text-[10px]">
                Design Revisions:
              </span>{" "}
              [{d.designRevisions}] rounds
            </p>
            <p>
              <span className="font-bold uppercase text-[10px]">
                Development Revisions:
              </span>{" "}
              [{d.devRevisions}] rounds
            </p>
            <p className="text-black/90 dark:text-white/90">
              {d.revisionPolicyNotes}
            </p>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 17. CHANGE REQUEST POLICY */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-16">
      <section id="section-17" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>17. CHANGE REQUEST MANAGEMENT</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 17
            </span>
          </h2>
          <div className="bg-black dark:bg-white text-white dark:text-[#121212] p-3 text-center font-bold text-xs uppercase tracking-wider mb-3">
            Client Request → Technical Review → Cost/Timeline Estimate → Client
            Approval → Development
          </div>
          <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
            {d.changeRequestPolicy}
          </p>
        </section>
    </React.Fragment>
  ),
  // {/* 18. CLIENT RESPONSIBILITIES */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-17">
      <section id="section-18" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>18. CLIENT RESPONSIBILITIES</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 18
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10">
            {d.clientResponsibilities.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </section>
    </React.Fragment>
  ),
  // {/* 19. QA & TESTING */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-18">
      <section id="section-19" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>19. TESTING &amp; QUALITY ASSURANCE</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 19
            </span>
          </h2>
          <div className="bg-neutral-50 dark:bg-white/5 p-3 text-center font-bold text-xs text-black dark:text-white border border-black dark:border-white/10 mb-2">
            {d.qaProcess}
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 20. BUG VS CHANGE REQUEST */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-19">
      <section id="section-20" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>20. BUG VS CHANGE REQUEST</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 20
            </span>
          </h2>
          <div className="text-xs text-[#1A1A1A] dark:text-[#F4F1EE] space-y-2 bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10">
            <p>
              <span className="font-bold uppercase text-[10px]">
                Bug Definition:
              </span>{" "}
              Occurs when documented functionality fails to execute per PRD.
            </p>
            <p>
              <span className="font-bold uppercase text-[10px]">
                Change Request:
              </span>{" "}
              Occurs when new or modified behavior beyond original PRD is
              requested.
            </p>
            <p className="text-black/90 dark:text-white/90">
              {d.bugVsChangePolicy}
            </p>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 21. CLIENT APPROVAL */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-20">
      <section id="section-21" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>21. CLIENT APPROVAL SLA</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 21
            </span>
          </h2>
          <p className="text-xs text-[#1A1A1A] dark:text-[#F4F1EE] leading-relaxed">
            Client feedback must be consolidated and delivered within{" "}
            <span className="font-bold">
              [{d.approvalFeedbackDays} business days]
            </span>{" "}
            following milestone delivery.
          </p>
        </section>
    </React.Fragment>
  ),
  // {/* 22. POST-LAUNCH SUPPORT */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-21">
      <section id="section-22" className="mb-8 relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
          <h2 className="font-serif italic text-xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-4 flex items-center justify-between">
            <span>22. POST-LAUNCH SUPPORT</span>
            <span className="text-[10px] font-sans not-italic uppercase tracking-widest text-black/60 dark:text-white/60 font-bold">
              SEC 22
            </span>
          </h2>
          <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1EE] mb-3">
            Included Support Window:{" "}
            <span className="font-mono">[{d.supportPeriod}]</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10">
              <h3 className="font-bold text-black dark:text-white uppercase text-[10px] tracking-wider mb-2 border-b border-black dark:border-white/10 pb-1">
                Included:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-black/80 dark:text-white/80">
                {d.includedSupport.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-50 dark:bg-white/5 p-4 border border-black dark:border-white/10">
              <h3 className="font-bold text-black dark:text-white uppercase text-[10px] tracking-wider mb-2 border-b border-black dark:border-white/10 pb-1">
                Not Included:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-black/80 dark:text-white/80">
                {d.notIncludedSupport.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
    </React.Fragment>
  ),
  // {/* 23 - 32 POLICIES GRID */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-22">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              23. HOSTING, DOMAIN &amp; THIRD-PARTY COSTS
            </h2>
            <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
              Unless explicitly included in the quotation, domain registration,
              server hosting, database services, and external API subscriptions
              are paid directly by the client.
            </p>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-23">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              24. INTELLECTUAL PROPERTY &amp; OWNERSHIP
            </h2>
            <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
              Full source code ownership transfers to the client upon full
              payment clearance of all project invoices.
            </p>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-24">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              25. CONFIDENTIALITY
            </h2>
            <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
              Both parties agree to protect proprietary source code,
              credentials, and business strategy information.
            </p>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-25">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              27. DATA &amp; BACKUPS
            </h2>
            <div className="bg-neutral-50 dark:bg-white/5 p-3 border border-black dark:border-white/10 text-xs space-y-1">
              <p>
                <span className="font-bold uppercase text-[9px] text-black/80 dark:text-white/80">
                  Backup Provider:
                </span>{" "}
                [{d.backupProvider}]
              </p>
              <p>
                <span className="font-bold uppercase text-[9px] text-black/80 dark:text-white/80">
                  Backup Frequency:
                </span>{" "}
                [{d.backupFrequency}]
              </p>
              <p>
                <span className="font-bold uppercase text-[9px] text-black/80 dark:text-white/80">
                  Retention Period:
                </span>{" "}
                [{d.backupRetention}]
              </p>
            </div>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-26">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              28. PROJECT DELAYS &amp; INACTIVITY
            </h2>
            <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
              Inactivity exceeding{" "}
              <span className="font-bold">[{d.delayThresholdDays} days]</span>{" "}
              due to client dependencies may result in project pausing and
              schedule re-estimation.
            </p>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-27">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              30. LIMITATIONS
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-black/80 dark:text-white/80 bg-neutral-50 dark:bg-white/5 p-3 border border-black dark:border-white/10">
              {d.limitations.map((l, idx) => (
                <li key={idx}>{l}</li>
              ))}
            </ul>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-28">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              31. OUT-OF-SCOPE WORK
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-black/80 dark:text-white/80 bg-neutral-50 dark:bg-white/5 p-3 border border-black dark:border-white/10">
              {d.outOfScope.map((o, idx) => (
                <li key={idx}>{o}</li>
              ))}
            </ul>
          </section>
    </React.Fragment>
  ),
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-29">
      <section className="mb-8 relative group section-container">
            {/* COPY_BTN */}
            <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
            <h2 className="font-serif italic text-base font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/20 pb-1 mb-2">
              32. FINAL HANDOVER ITEMS
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-black/80 dark:text-white/80 bg-neutral-50 dark:bg-white/5 p-3 border border-black dark:border-white/10">
              {d.finalHandoverItems.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </section>
    </React.Fragment>
  ),
  // {/* 33. ADDITIONAL LEGAL CLAUSES */}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-30">
{d.additionalLegalClauses &&
          Object.values(d.additionalLegalClauses).some(Boolean) && (
            <div className="pdf-page-break-before space-y-6 pt-6">
              <section id="section-33" className="mb-8 relative group section-container">
                {/* COPY_BTN */}
                <SectionControls index={index} total={31} moveUp={moveUp} moveDown={moveDown} />
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/30 pb-2 mb-4">
                  33. ADDITIONAL LEGAL CLAUSES
                </h2>
                <div className="space-y-6 text-sm">
                  {d.additionalLegalClauses.nda && (
                    <div>
                      <h3 className="font-bold mb-1">
                        Non-Disclosure Agreement (NDA)
                      </h3>
                      <p className="text-black/80 dark:text-white/80 leading-relaxed text-xs">
                        Both parties agree to keep all sensitive information,
                        including source code, business strategies, and client
                        data, strictly confidential during and after the project
                        duration. Information shall not be disclosed to third
                        parties without prior written consent.
                      </p>
                    </div>
                  )}
                  {d.additionalLegalClauses.ipAssignment && (
                    <div>
                      <h3 className="font-bold mb-1">
                        Intellectual Property (IP) Assignment
                      </h3>
                      <p className="text-black/80 dark:text-white/80 leading-relaxed text-xs">
                        Upon full and final payment, the Service Provider agrees
                        to assign, transfer, and convey all rights, title, and
                        interest in the custom deliverables (including custom
                        source code and design assets) exclusively to the
                        Client. Third-party open-source components remain under
                        their respective licenses.
                      </p>
                    </div>
                  )}
                  {d.additionalLegalClauses.nonCompete && (
                    <div>
                      <h3 className="font-bold mb-1">Non-Compete</h3>
                      <p className="text-black/80 dark:text-white/80 leading-relaxed text-xs">
                        The Service Provider agrees not to independently build
                        or offer an exact replica of the Client’s core
                        proprietary software to a direct competitor of the
                        Client for a period of 12 months following project
                        completion.
                      </p>
                    </div>
                  )}
                  {d.additionalLegalClauses.termination && (
                    <div>
                      <h3 className="font-bold mb-1">Termination Terms</h3>
                      <p className="text-black/80 dark:text-white/80 leading-relaxed text-xs">
                        Either party may terminate this agreement with 14 days
                        written notice. In the event of termination by the
                        Client before project completion, the Client agrees to
                        pay for all work completed up to the termination date
                        based on an hourly rate or prorated milestone
                        calculation.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
    </React.Fragment>
  ),
];

export const DocumentView: React.FC<DocumentViewProps> = ({
  data: d,
  printMode = "full",
}) => {


  const getSectionIdForIdx = (idx: number) => {
    if (idx <= 24) return idx + 1;
    if (idx === 25) return 27;
    if (idx === 26) return 28;
    if (idx === 27) return 30;
    if (idx === 28) return 31;
    if (idx === 29) return 32;
    return -1;
  };

  const [order, setOrder] = React.useState<number[]>(Array.from({ length: 31 }, (_, i) => i));
  const moveUp = (idx: number) => {
    setOrder(prev => {
      const newOrder = [...prev];
      const pos = newOrder.indexOf(idx);
      if (pos > 0) {
        [newOrder[pos - 1], newOrder[pos]] = [newOrder[pos], newOrder[pos - 1]];
      }
      return newOrder;
    });
  };
  const moveDown = (idx: number) => {
    setOrder(prev => {
      const newOrder = [...prev];
      const pos = newOrder.indexOf(idx);
      if (pos < newOrder.length - 1) {
        [newOrder[pos + 1], newOrder[pos]] = [newOrder[pos], newOrder[pos + 1]];
      }
      return newOrder;
    });
  };


  const prdSectionClass = printMode === "agreement" ? "hidden" : "mb-8";

  return (
    <div className="bg-[#D9D5CF] dark:bg-transparent p-1 sm:p-6 md:p-8 no-print-bg">
      {printMode === "full" && (
        <style>{`
          #prd-document-preview {
            counter-reset: ui-page;
          }
          #prd-document-preview > div.pdf-page-break-after,
          #prd-document-preview > div.border-b-2.pb-6,
          #prd-document-preview > section,
          #prd-document-preview > div.space-y-6.mb-8,
          #prd-document-preview > div.pdf-page-break-before {
            position: relative;
          }
          #prd-document-preview > div.pdf-page-break-after::after,
          #prd-document-preview > div.border-b-2.pb-6::after,
          #prd-document-preview > section::after,
          #prd-document-preview > div.space-y-6.mb-8::after,
          #prd-document-preview > div.pdf-page-break-before::after {
            counter-increment: ui-page;
            content: "- PAGE " counter(ui-page) " -";
            display: block;
            text-align: center;
            margin-top: 3rem;
            margin-bottom: -1rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.2em;
            color: rgba(0,0,0,0.25);
          }
          .dark #prd-document-preview > div.pdf-page-break-after::after,
          .dark #prd-document-preview > div.border-b-2.pb-6::after,
          .dark #prd-document-preview > section::after,
          .dark #prd-document-preview > div.space-y-6.mb-8::after,
          .dark #prd-document-preview > div.pdf-page-break-before::after {
            color: rgba(255,255,255,0.25);
          }
          @media print {
            #prd-document-preview > div.pdf-page-break-after::after,
            #prd-document-preview > div.border-b-2.pb-6::after,
            #prd-document-preview > section::after,
            #prd-document-preview > div.space-y-6.mb-8::after,
            #prd-document-preview > div.pdf-page-break-before::after {
              display: none !important;
            }
          }
        `}</style>
      )}
      <div
        id="prd-document-preview"
        className="print-container bg-white dark:bg-[#1C1C1C] text-[#1A1A1A] dark:text-[#E0E0E0] p-4 sm:p-8 md:p-12 max-w-4xl mx-auto shadow-2xl border border-black dark:border-white/10 my-2 sm:my-4"
      >
        {/* ========================================================
            AUTOMATIC HIGH-END COVER PAGE LAYOUT
           ======================================================== */}
        <div className="pdf-page-break-after border-2 sm:border-4 border-black dark:border-white/30 p-4 sm:p-12 md:p-16 min-h-0 sm:min-h-[920px] flex flex-col justify-between text-center relative bg-[#FAF9F6] dark:bg-[#121212] mb-8 sm:mb-12 shadow-sm">
          {/* Inner Decorative Framing Border */}
          <div className="absolute top-3 left-3 right-3 bottom-3 border border-black dark:border-white/20 pointer-events-none" />

          {d.brandingLogoUrl && (
            <div className="absolute top-12 left-0 right-0 flex justify-center pointer-events-none">
              <img src={d.brandingLogoUrl} alt="Logo" className="max-h-24 object-contain" />
            </div>
          )}
          {/* Top Classification Banner */}
          <div className="space-y-2 pt-4 relative z-10">
            <div className="inline-block bg-black dark:bg-white text-white dark:text-[#121212] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
              {d.coverBadge || "Confidential & Proprietary"}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/80 dark:text-white/80 font-semibold pt-1">
              {d.coverDocumentType || "Product Requirement Specification & Development Agreement"}
            </div>
          </div>

          {/* Centerpiece Typographic Display */}
          <div className="my-auto py-10 space-y-6 relative z-10 px-4">
            <div className="text-[11px] uppercase font-mono tracking-[0.3em] text-black/70 dark:text-white/70 font-bold">
              {d.coverSubtitle || "— Official Project Specification —"}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-[#1A1A1A] dark:text-[#F4F1EE] uppercase tracking-tight leading-tight max-w-3xl mx-auto break-words">
              {d.projectName || "UNTITLED PROJECT"}
            </h1>

            <div className="w-24 h-1 bg-black dark:bg-white mx-auto my-4" />

            <p className="font-serif italic text-base sm:text-xl text-black/80 dark:text-white/80 max-w-xl mx-auto leading-relaxed">
              {d.coverDescription || "Comprehensive Technical Architecture, Functional Requirements & Commercial Scope Agreement"}
            </p>

            {/* Centered Metadata Card */}
            <div className="max-w-lg mx-auto bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/20 p-4 sm:p-6 shadow-sm my-6 sm:my-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/60 dark:text-white/60 block font-bold">
                  Client / Company
                </span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-sm block mt-0.5">
                  {d.clientName || "[Client Name]"}
                </span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/60 dark:text-white/60 block font-bold">
                  Service Provider
                </span>
                <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-sm block mt-0.5">
                  {d.serviceProvider || "[Provider Name]"}
                </span>
              </div>
              <div className="border-t border-black dark:border-white/10 pt-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/60 dark:text-white/60 block font-bold">
                  Document Version
                </span>
                <span className="font-bold font-mono text-[#1A1A1A] dark:text-[#F4F1EE] text-xs block mt-0.5">
                  v{d.docVersion || "1.0"}
                </span>
              </div>
              <div className="border-t border-black dark:border-white/10 pt-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/60 dark:text-white/60 block font-bold">
                  Effective Date
                </span>
                <span className="font-bold font-mono text-[#1A1A1A] dark:text-[#F4F1EE] text-xs block mt-0.5">
                  {d.date || "[DD/MM/YYYY]"}
                </span>
              </div>
              {d.projectCost && (
                <div className="border-t border-black dark:border-white/10 pt-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-black/60 dark:text-white/60 block font-bold">
                    Agreed Valuation
                  </span>
                  <span className="font-bold text-black dark:text-white text-xs block mt-0.5">
                    {d.currencySymbol}
                    {d.projectCost}
                  </span>
                </div>
              )}
              {d.estimatedTimeline && (
                <div className="border-t border-black dark:border-white/10 pt-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-black/60 dark:text-white/60 block font-bold">
                    Delivery Timeline
                  </span>
                  <span className="font-bold text-black dark:text-white text-xs block mt-0.5">
                    {d.estimatedTimeline}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Seal & Handover Footer */}
          <div className="relative z-10 pb-4 border-t border-black dark:border-white/20 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-black/70 dark:text-white/70 uppercase tracking-widest">
            <span>
              Ref: PRD-{d.docVersion || "1.0"} • {d.projectName || "Document"}
            </span>
            <span className="font-bold text-black/80 dark:text-white/80">
              Authorized Binding Specification
            </span>
          </div>
        </div>

        {/* Header Block / Executive Summary Table (Page 2) */}
        <div className="border-b-2 border-black dark:border-white/30 pb-6 mb-8">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-black/60 dark:text-white/60 mb-3 border-b border-black dark:border-white/10 pb-2">
            <span>Official Requirement & Agreement Specification</span>
            <span>Ref: {d.docVersion || "1.0"}</span>
          </div>

          <h1 className="font-serif text-2xl md:text-4xl font-black text-[#1A1A1A] dark:text-[#F4F1EE] uppercase tracking-tight mb-4 leading-tight">
            PRODUCT REQUIREMENTS &amp; PROJECT AGREEMENT
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 bg-neutral-50 dark:bg-white/5 p-5 border border-black dark:border-white/10 text-xs">
            <div>
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Project Name
              </span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-sm">
                {d.projectName || "[Project Name]"}
              </span>
            </div>
            <div>
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Client Name
              </span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-sm">
                {d.clientName || "[Client / Company Name]"}
              </span>
            </div>
            <div>
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Service Provider
              </span>
              <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EE]">
                {d.serviceProvider || "[Your Name / Company]"}
              </span>
            </div>
            <div>
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Document Version
              </span>
              <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EE]">
                {d.docVersion || "1.0"}
              </span>
            </div>
            <div>
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Effective Date
              </span>
              <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EE]">
                {d.date || "[DD/MM/YYYY]"}
              </span>
            </div>
            <div>
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Project Valuation
              </span>
              <span className="font-bold text-black dark:text-white text-sm">
                {d.currencySymbol}
                {d.projectCost || "[Amount]"}
              </span>
            </div>
            <div className="md:col-span-2 border-t border-black dark:border-white/10 pt-2 mt-1">
              <span className="font-bold text-black/70 dark:text-white/70 uppercase text-[9px] tracking-wider block">
                Estimated Delivery Timeline
              </span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">
                {d.estimatedTimeline || "[X Days / Weeks]"}
              </span>
            </div>
          </div>
        </div>

        
        {/* DYNAMIC SECTIONS REORDERING */}
        <div className="flex flex-col">
          {order.filter(idx => !d.hiddenSections?.includes(getSectionIdForIdx(idx))).map(idx => sectionBlocks[idx](d, prdSectionClass, idx, moveUp, moveDown))}
        </div>

{/* 34. FINAL APPROVAL & SIGN-OFF */}
        {!d.hiddenSections?.includes(33) && (
        <section id="section-33" className="pt-6 border-t-2 border-black dark:border-white/30 pdf-page-break-before relative group section-container">
          {/* COPY_BTN */}
          <SectionControls index={31} total={32} moveUp={() => {}} moveDown={() => {}} />
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F1EE] border-b border-black dark:border-white/30 pb-2 mb-4">
            {d.additionalLegalClauses &&
            Object.values(d.additionalLegalClauses).some(Boolean)
              ? "34"
              : "33"}
            . FINAL APPROVAL &amp; SIGN-OFF
          </h2>
          <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed mb-6">
            By signing below, both parties confirm their explicit acceptance of
            the documented project scope, deliverables, commercial valuation,
            and terms specified in this document.
          </p>

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* CLIENT */}
            <div className="border border-black dark:border-white/30 p-5 bg-neutral-50 dark:bg-white/5">
              <h3 className="font-black text-black dark:text-white uppercase text-xs tracking-widest mb-4 pb-2 border-b border-black dark:border-white/20">
                CLIENT REPRESENTATIVE
              </h3>
              <div className="space-y-3 text-xs">
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block">
                    Name
                  </span>{" "}
                  {d.clientSignoff.name || "______________________________"}
                </p>
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block">
                    Company
                  </span>{" "}
                  {d.clientSignoff.company || "___________________________"}
                </p>
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block mb-2">
                    Signature
                  </span>
                  {d.clientSignoff.signatureDataUrl ? (
                    <img src={d.clientSignoff.signatureDataUrl} alt="Client Signature" className="h-16 object-contain" />
                  ) : (
                    "__________________________"
                  )}
                </p>
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block">
                    Date
                  </span>{" "}
                  {d.clientSignoff.signatureDate ||
                    "______________________________"}
                </p>
              </div>
            </div>

            {/* SERVICE PROVIDER */}
            <div className="border border-black dark:border-white/30 p-5 bg-neutral-50 dark:bg-white/5">
              <h3 className="font-black text-black dark:text-white uppercase text-xs tracking-widest mb-4 pb-2 border-b border-black dark:border-white/20">
                SERVICE PROVIDER
              </h3>
              <div className="space-y-3 text-xs">
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block">
                    Name
                  </span>{" "}
                  {d.providerSignoff.name || "______________________________"}
                </p>
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block">
                    Company
                  </span>{" "}
                  {d.providerSignoff.company || "___________________________"}
                </p>
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block mb-2">
                    Signature
                  </span>
                  {d.providerSignoff.signatureDataUrl ? (
                    <img src={d.providerSignoff.signatureDataUrl} alt="Provider Signature" className="h-16 object-contain" />
                  ) : (
                    "__________________________"
                  )}
                </p>
                <p>
                  <span className="font-bold text-black/80 dark:text-white/80 uppercase text-[9px] block">
                    Date
                  </span>{" "}
                  {d.providerSignoff.signatureDate ||
                    "______________________________"}
                </p>
              </div>
            </div>
          </div>

          {/* DOCUMENT APPROVAL METADATA BOX */}
          <div className="border border-black dark:border-white/30 p-4 bg-black dark:bg-white text-white dark:text-[#121212] text-xs">
            <h3 className="font-bold uppercase tracking-widest mb-2 text-white dark:text-[#121212]/80 text-[10px]">
              DOCUMENT APPROVAL METADATA
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
              <p>
                <span className="text-white dark:text-[#121212]/50 block font-mono text-[9px] uppercase">
                  PRD Version
                </span>{" "}
                {d.documentApproval.prdVersion}
              </p>
              <p>
                <span className="text-white dark:text-[#121212]/50 block font-mono text-[9px] uppercase">
                  Status
                </span>{" "}
                <span className="font-bold text-amber-300">
                  {d.documentApproval.status}
                </span>
              </p>
              <p>
                <span className="text-white dark:text-[#121212]/50 block font-mono text-[9px] uppercase">
                  Approval Date
                </span>{" "}
                {d.documentApproval.clientApprovalDate}
              </p>
              <p>
                <span className="text-white dark:text-[#121212]/50 block font-mono text-[9px] uppercase">
                  Start Date
                </span>{" "}
                {d.documentApproval.projectStartDate}
              </p>
              <p className="col-span-2">
                <span className="text-white dark:text-[#121212]/50 block font-mono text-[9px] uppercase">
                  Expected Delivery
                </span>{" "}
                {d.documentApproval.expectedDeliveryDate}
              </p>
            </div>
          </div>
        </section>
        )}
      </div>
    </div>
  );
};
