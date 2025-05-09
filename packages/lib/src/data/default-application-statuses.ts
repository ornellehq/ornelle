export const defaultApplicationStatuses = [
  {
    category: "Not started",
    name: "New Application / Applied",
    description: "Candidate has submitted their application.",
    colorCode: "#A0A0A0",
  },
  {
    category: "In Progress",
    name: "Screening in Progress",
    description: "Application is under initial review (automated or manual).",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Shortlisted / Pending Review",
    description:
      "Passed initial screen, awaiting deeper review by HR/Recruiter.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Phone Screen",
    description: "The initial call has taken place, awaiting outcome.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Hiring Manager Interview",
    description:
      "Passed phone screen; awaiting or undergoing interview with the Hiring Manager.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Technical Interview",
    description:
      "Passed previous stage; awaiting or undergoing technical interview.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Coding Test",
    description: "Passed previous stage; awaiting or undergoing coding test.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Skills Assessment",
    description:
      "Passed previous stage; awaiting or undergoing skills assessment (e.g., portfolio review, writing test).",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Assessment 1",
    description:
      "Passed previous stage; awaiting or undergoing generic assessment 1.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Assessment 2",
    description:
      "Passed previous stage; awaiting or undergoing generic assessment 2.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Culture Interview",
    description:
      "Passed previous stage; awaiting or undergoing culture interview.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Final/Executive(s) Interview",
    description:
      "Passed previous stages; awaiting or undergoing final interview(s).",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Final Review / Debrief Pending",
    description:
      "All interviews/assessments completed, team is reviewing feedback to make a selection decision.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Reference Check",
    description: "Selected candidate identified; ready to contact references.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Background Check",
    description:
      "Background check process has started (often post-offer or conditional).",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Offer",
    description:
      "Offer preparation, presentation, negotiation, and finalization with the candidate.",
    colorCode: "#3498DB",
  },
  {
    category: "In Progress",
    name: "Pre-boarding / Ready to Hire",
    description:
      "Offer accepted, background check cleared, preparing for start date.",
    colorCode: "#3498DB",
  },
  {
    category: "Completed",
    name: "Hired",
    description: "Candidate has officially started employment.",
    colorCode: "#2ECC71",
  },
  {
    category: "Completed",
    name: "Onboarding",
    description:
      "New hire is currently in the initial integration and training period.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Not a Fit",
    description: "Candidate doesn't meet basic requirements.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Initial Screen",
    description: "Did not meet minimum qualifications during initial review.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Recruiter Review",
    description: "Did not pass the more detailed HR/Recruiter review.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Phone Screen",
    description: "Not selected after the initial phone screen.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Hiring Manager Interview",
    description: "Not selected after the Hiring Manager interview.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Technical Interview",
    description: "Not selected after the technical interview.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Coding Test",
    description: "Not selected after the coding test.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Skills Assessment",
    description: "Not selected after the skills assessment.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Assessment 1",
    description: "Not selected after generic assessment 1.",
    colorCode: "#3498DB",
  },
  {
    category: "Rejected",
    name: "Rejected - Assessment 2",
    description: "Not selected after generic assessment 2.",
    colorCode: "#3498DB",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Culture Interview",
    description: "Not selected after the culture interview.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Final/Executive(s) Interview",
    description: "Not selected after the final interview.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Rejected - Post Final Review",
    description: "Not selected after final deliberations by the hiring team.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Offer Declined",
    description: "Candidate chose not to accept the job offer.",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Offer Rescinded",
    description:
      "Company withdrew the offer (e.g., due to background check issues, misrepresentation).",
    colorCode: "#2ECC71",
  },
  {
    category: "Rejected",
    name: "Withdrawn",
    description:
      "Candidate removed themselves from consideration at any stage.",
    colorCode: "#2ECC71",
  },
  {
    category: "In Progress",
    name: "On Hold",
    description:
      "The hiring process for this role or candidate is temporarily paused.",
    colorCode: "#2ECC71",
  },
  {
    category: "In Progress",
    name: "Future Consideration / Keep Warm",
    description:
      "Promising candidate, but no suitable role currently; keep profile for future opportunities.",
    colorCode: "#2ECC71",
  },
] as const
