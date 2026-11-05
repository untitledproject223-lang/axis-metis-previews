window.AXIS = {
  company: {
    name: "Axis Metis",
    legalName: "AXIS METIS",
    email: "admin@axismetis.co.za",
    city: "Johannesburg",
    country: "South Africa",
  },

  hero: {
    title: "The operational systems your business runs on.",
    body: "Axis Metis designs, builds, and supports custom platforms for property, hospitality, healthcare, education, and travel businesses. Scope is written first, the build is tested before launch, and the system is handed over into your ownership.",
  },

  assurances: [
    { title: "Written scope", body: "Deliverables and acceptance criteria before the build starts" },
    { title: "Your ownership", body: "Source, infrastructure, and accounts handed over in your name" },
    { title: "Tested first", body: "Sign-off on a staging environment before anything goes live" },
    { title: "Johannesburg", body: "A South African delivery team, working in your time zone" },
  ],

  practices: [
    {
      title: "Operational platforms & CRM",
      body: "Systems of record for how a business actually runs: clients, deals, jobs, invoicing, and reporting, modelled on your workflow rather than a generic template.",
      points: ["Client & deal pipelines", "Invoicing and payment records", "Role-based access control", "Migration from spreadsheets", "Operational reporting"],
    },
    {
      title: "Commerce & customer portals",
      body: "Storefronts, ordering flows, and self-service portals with the admin tooling behind them, so your team can run catalogue, stock, and orders without developer involvement.",
      points: ["Catalogue & stock control", "Checkout and payments", "Order and fulfilment admin", "Customer accounts", "iOS and Android apps"],
    },
    {
      title: "Custom software",
      body: "Bespoke applications and internal tooling, built around the process your team already runs.",
      points: ["Web and mobile applications", "API design and delivery", "Data pipelines and reporting", "Legacy system replacement"],
    },
  ],

  phases: [
    { title: "Discovery", body: "We sit with the people who do the work, map the current process, and identify where the cost and risk actually sit.", output: "Requirements and process map" },
    { title: "Scope & proposal", body: "A written scope with deliverables, milestones, acceptance criteria, and a fixed commercial figure before any code is written.", output: "Signed scope of work" },
    { title: "Architecture", body: "Data model, access control, and hosting decided and documented up front so the build does not stall halfway.", output: "Technical design" },
    { title: "Build", body: "Delivery in reviewable increments on a staging environment, so you see working software throughout rather than at the end.", output: "Staged releases" },
    { title: "Test & sign-off", body: "Functional testing, access-control and security review, and user acceptance against the criteria agreed in the scope.", output: "Sign-off record" },
    { title: "Handover & support", body: "Documentation, staff training, and transfer of code and infrastructure into your ownership, followed by an agreed support arrangement.", output: "Documentation & support" },
  ],

  standards: [
    { title: "Fixed scope, written up front", body: "Every engagement starts with a written scope, deliverables, and acceptance criteria, so there is no ambiguity about what is being built or when it is done." },
    { title: "You own the code", body: "Source code, infrastructure, and accounts are handed over in your name. There is no lock-in, and the system does not depend on us to keep operating." },
    { title: "Tested before it ships", body: "Functional testing, access-control checks, and a staged environment for sign-off before anything reaches the people who rely on it." },
    { title: "Documented handover", body: "Admin walkthroughs, written documentation, and a training session for the staff who will run the system day to day." },
    { title: "Security reviewed in-house", body: "Authentication, permissions, and data handling reviewed by our own cybersecurity specialist rather than left to chance." },
    { title: "Support after go-live", body: "An agreed support arrangement after launch, covering fixes, small changes, and the next phase of work when you are ready." },
  ],

  technology: [
    { label: "Application", items: ["TypeScript", "React", "Next.js", "Node.js"] },
    { label: "Mobile", items: ["iOS", "Android", "React Native"] },
    { label: "Data", items: ["PostgreSQL", "Neon", "SQL reporting", "Migrations"] },
    { label: "Platform", items: ["Vercel", "CI/CD", "Observability", "Backups"] },
    { label: "APIs", items: ["REST APIs", "Webhooks"] },
    { label: "Security", items: ["Access control", "Hardening reviews", "Audit logging"] },
  ],

  sectors: ["Property", "Hospitality", "Healthcare", "Education", "Travel"],

  fit: {
    yes: [
      { title: "The process is specific", body: "Your workflow, approvals, and records do not match a generic product without costly workarounds." },
      { title: "The system is operational", body: "Staff will use it every day for clients, orders, jobs, or reporting, not as a brochure." },
      { title: "Ownership matters", body: "You need the source, accounts, and data in your name, with a documented handover." },
    ],
    no: [
      { title: "A standard product already fits", body: "If an existing platform covers the process cleanly, buying it is usually the better decision." },
      { title: "The brief is still a slogan", body: "We need a real process to map. An idea without operators, records, or constraints is not yet a build." },
      { title: "The work is a visual refresh only", body: "We design interfaces as part of a system. We are not a marketing studio for campaigns or brand-only sites." },
    ],
  },

  projects: [
    {
      slug: "digital-dwella",
      sector: "Property",
      name: "Digital Dwella",
      summary: "Letting CRM for units, tenants, rent, and tickets.",
      logo: "assets/logos/digital-dwella.svg",
      color: "#134e4a",
      kicker: "The work",
      work: "A property operations platform delivered as three products, Urban, Township, and Stay, each modelled on a different letting environment.",
      outcome: "Estate tenancies, on-the-ground placement, and accommodation sites run as distinct products on one platform.",
      groups: [
        {
          label: "Products",
          items: [
            { title: "Urban", body: "Manages tenancies in urban estates, where applications are reviewed in depth and tenants are approved only after a formal screening process." },
            { title: "Township", body: "Built for on-the-go tenant management. Placement is faster, and applications are not subject to the same scrutiny applied in Urban." },
            { title: "Stay", body: "Operates an accommodation property as a whole, such as student residences and other multi-occupancy sites, covering occupancy and day-to-day operations in one record." },
          ],
        },
        {
          label: "What it had to handle",
          items: [
            { title: "Different rules per environment", body: "Formal screening in urban estates, faster placement in townships, and whole-property operations for accommodation sites, without forcing one process on all three." },
            { title: "One record per tenancy", body: "Units, tenants, rent, and maintenance tickets kept together instead of across separate lists." },
          ],
        },
        {
          label: "Used by",
          items: [{ title: "Letting staff and property managers", body: "" }],
        },
      ],
      shipped: ["Urban", "Township", "Stay", "Tenancies & rent"],
    },
    {
      slug: "pheli-seafood",
      sector: "Hospitality",
      name: "Pheli Seafood",
      summary: "Restaurant ordering and kitchen dispatch on web and mobile.",
      logo: "assets/logos/pheli-seafood.svg",
      color: "#0c4a6e",
      kicker: "Commerce + mobile",
      work: "Ordering platform and kitchen administration for a high-volume Atteridgeville restaurant, with native apps on both mobile platforms.",
      outcome: "Online ordering and kitchen dispatch running on one order queue.",
      groups: [
        {
          label: "What it had to handle",
          items: [
            { title: "High order volume", body: "A busy Atteridgeville restaurant taking orders through the website and native iOS and Android apps at the same time." },
            { title: "One queue for the kitchen", body: "Every order, whatever channel it came from, lands in the same queue the kitchen works from." },
            { title: "Menu and stock control", body: "Staff update the menu and stock themselves, without a developer." },
          ],
        },
        {
          label: "Used by",
          items: [{ title: "Customers ordering, and the kitchen team", body: "" }],
        },
      ],
      shipped: ["Menu & stock", "Checkout", "Kitchen admin", "iOS · Android"],
    },
    {
      slug: "vital-plate",
      sector: "Healthcare",
      name: "Vital Plate",
      summary: "Dietetics practice desk for records, bookings, and meal plans.",
      logo: "assets/logos/vital-plate.svg",
      color: "#14532d",
      kicker: "Practice system",
      work: "Patient records, bookings, and consultation notes for a dietetics practice, built around clinical confidentiality requirements.",
      outcome: "Consolidated patient history and bookings into one practice desk.",
      groups: [
        {
          label: "What it had to handle",
          items: [
            { title: "Clinical confidentiality", body: "Patient records and consultation notes are only visible to the people who should see them." },
            { title: "One patient history", body: "Bookings, consultation notes, and meal plans linked to the same patient instead of kept in separate places." },
          ],
        },
        {
          label: "Used by",
          items: [{ title: "Dietitians and practice staff", body: "" }],
        },
      ],
      shipped: ["Patient records", "Consultations", "Bookings", "Practice desk"],
    },
    {
      slug: "dka-school",
      sector: "Education",
      name: "DKA School",
      summary: "School website and admin for learners, parents, and staff.",
      logo: "assets/logos/dka-school.jpeg",
      color: "#0b2a5b",
      kicker: "Public website",
      work: "Public-facing website for Divine Kingdom Academy covering academics, admissions, news, and contact, structured for parents and prospective families.",
      outcome: "Gave admissions a single authoritative public channel.",
      groups: [
        {
          label: "What it had to handle",
          items: [
            { title: "Several audiences", body: "Parents, prospective families, and staff each need different information, so the site is organised around what each group is looking for." },
            { title: "One place for admissions", body: "Academics, admissions, news, and contact sit in one structure, so families get the same answer wherever they look." },
          ],
        },
        {
          label: "Used by",
          items: [{ title: "Parents, prospective families, and school staff", body: "" }],
        },
      ],
      shipped: ["Homepage", "Academics", "Admissions", "News & events"],
    },
    {
      slug: "nendila-travels",
      sector: "Travel",
      name: "Nendila Travels",
      summary: "Travel agency bookings, clients, and PDF invoices.",
      logo: "assets/logos/nendila-travels.svg",
      color: "#713f12",
      kicker: "Agency system",
      work: "Booking, client management, and invoicing for a travel agency, including generated PDF documentation for travellers.",
      outcome: "Bookings, clients, and invoicing handled in one agency system.",
      groups: [
        {
          label: "What it had to handle",
          items: [
            { title: "Booking to invoice in one flow", body: "A booking, the client it belongs to, and the invoice for it are kept in the same system." },
            { title: "Documents for travellers", body: "PDF invoices and travel documentation are generated from the booking rather than typed up separately." },
          ],
        },
        {
          label: "Used by",
          items: [{ title: "Agency consultants and their travellers", body: "" }],
        },
      ],
      shipped: ["Bookings", "Clients", "PDF invoices", "Documents"],
    },
  ],

  needs: ["Operational platform / CRM", "Commerce or customer portal", "Custom software", "Mobile application", "Not sure yet"],

  privacy: [
    { title: "Who we are", body: "Axis Metis is a software engineering practice based in Johannesburg, South Africa. For privacy questions, write to admin@axismetis.co.za." },
    { title: "What we collect", body: "If you send an enquiry, we collect the name, email address, company name, type of work, and message you submit. Our servers and analytics, if any, may also record technical data such as IP address, browser type, and pages requested." },
    { title: "Why we use it", body: "We use enquiry details to reply to you, assess whether we can take the work, and keep a record of the correspondence. We do not sell personal information or use it for unrelated marketing lists." },
    { title: "Who processes it", body: "The contact form is sent through EmailJS, a third-party email service. Message contents are transmitted to us at the address above. Hosting and delivery providers that operate this website may process technical logs as part of providing the service." },
    { title: "How long we keep it", body: "We keep enquiry correspondence for as long as needed to complete the conversation and, where a project follows, for the life of that engagement and any legal retention duty that applies." },
    { title: "Your rights", body: "You may ask us to confirm what we hold, correct it, or delete it, subject to any legal duty to retain records. Write to admin@axismetis.co.za. You may also lodge a complaint with the Information Regulator of South Africa." },
  ],

  terms: [
    { title: "The site", body: "This website describes Axis Metis and the work we have delivered. Content is provided for information. We take care to keep it accurate, but it is not an offer, quotation, or warranty." },
    { title: "Enquiries", body: "Submitting the contact form is a request for a conversation. It does not create an engagement. We will tell you if we can help and, if so, set out scope and commercial terms in writing before any build starts." },
    { title: "Intellectual property", body: "The site design, copy, and mark belong to Axis Metis unless otherwise noted. Client names, marks, and project descriptions appear with permission or as a factual record of work delivered. Do not copy them without consent." },
    { title: "Client work", body: "Some engagements are confidential. Where a case study does not link to a live product, treat the detail as a description of work, not a public demonstration or invitation to contact that client." },
    { title: "Limitation", body: "To the extent permitted by South African law, we are not liable for loss arising from use of this website or reliance on its contents. Nothing here limits liability that cannot be limited by law." },
    { title: "Changes", body: "We may update these terms and the Privacy notice. The version published on this website is the current one. Questions: admin@axismetis.co.za." },
  ],

  emailjs: {
    publicKey: "Xwnko4Abre7oYt5aF",
    serviceId: "service_hjfe2r4",
    templateId: "template_o6sr10a",
    adminName: "AXIS METIS",
  },
};
