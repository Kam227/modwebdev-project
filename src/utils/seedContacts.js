const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const JS_KEY = import.meta.env.VITE_PARSE_JS_KEY;
const MASTER_KEY  = import.meta.env.VITE_PARSE_MASTER_KEY;
const BASE = "https://parseapi.back4app.com";

export const SEED_PASSWORD = "WorkHub2024!";

const WORKERS = [
  { firstName: "Marcus", lastName: "Thompson", email: "mthompson@workhub.com"},
  { firstName: "Aaliyah", lastName: "Brooks", email: "abrooks@workhub.com"},
  { firstName: "Tyler", lastName: "Nguyen", email: "tnguyen@workhub.com"},
];

const SUPPLIERS = [
  {
    firstName: "James",   lastName: "Carter",
    email: "jcarter@workhub.com",
    phone: "574-555-0101",
    serviceLocations: ["120 S St Joseph St, South Bend IN 46601"],
    tasks: [
      {
        Description: "Electrical panel upgrade for warehouse",
        Location: "120 S St Joseph St, South Bend IN 46601", Latitude: 41.6768, Longitude: -86.2512, Openings: 2, Specialty: "Electrical",
        certificate: { Name: "Journeyman Electrician License", IssuingOrganization: "Indiana Dept of Licensing", Requirements: "2 years supervised electrical work", Specialty: "Electrical", Hours: 40 },
      },
      {
        Description: "Lighting installation for commercial office",
        Location: "120 S St Joseph St, South Bend IN 46601", Latitude: 41.6768, Longitude: -86.2512, Openings: 1, Specialty: "Electrical",
        certificate: { Name: "Commercial Electrical Certification", IssuingOrganization: "NECA Indiana", Requirements: "OSHA 10 + electrical safety training", Specialty: "Electrical", Hours: 10 },
      },
    ],
  },
  {
    firstName: "Maria",   lastName: "Gonzalez",
    email: "mgonzalez@workhub.com",
    phone: "574-555-0102",
    serviceLocations: ["4190 Edison Lakes Pkwy, Mishawaka IN 46545"],
    tasks: [
      {
        Description: "HVAC installation for new office building",
        Location: "4190 Edison Lakes Pkwy, Mishawaka IN 46545", Latitude: 41.6848, Longitude: -86.1621, Openings: 3, Specialty: "HVAC",
        certificate: { Name: "EPA 608 Refrigerant Certification", IssuingOrganization: "EPA / HVAC Excellence", Requirements: "Pass EPA 608 Type II or Universal exam", Specialty: "HVAC", Hours: 8 },
      },
    ],
  },
  {
    firstName: "DeShawn", lastName: "Williams",
    email: "dwilliams@workhub.com",
    phone: "574-555-0103",
    serviceLocations: ["1032 N Ironwood Dr, South Bend IN 46615"],
    tasks: [
      {
        Description: "Plumbing rough-in for apartment complex",
        Location: "1032 N Ironwood Dr, South Bend IN 46615", Latitude: 41.6912, Longitude: -86.2350, Openings: 4, Specialty: "Plumbing",
        certificate: { Name: "Journeyman Plumber License", IssuingOrganization: "Indiana State Board of Plumbing Examiners", Requirements: "4 years apprenticeship + state exam", Specialty: "Plumbing", Hours: 32 },
      },
      {
        Description: "Water heater replacement — 12 units",
        Location: "1032 N Ironwood Dr, South Bend IN 46615", Latitude: 41.6915, Longitude: -86.2179, Openings: 2, Specialty: "Plumbing",
        certificate: { Name: "Water Heater Installation Certification", IssuingOrganization: "PHCC Indiana", Requirements: "Plumbing license + manufacturer training", Specialty: "Plumbing", Hours: 16 },
      },
    ],
  },
  {
    firstName: "Sara",    lastName: "Kim",
    email: "skim@workhub.com",
    phone: "574-555-0104",
    serviceLocations: ["2505 Grape Rd, Mishawaka IN 46545"],
    tasks: [
      {
        Description: "Interior carpentry for retail renovation",
        Location: "2505 Grape Rd, Mishawaka IN 46545", Latitude: 41.6601, Longitude: -86.1453, Openings: 2, Specialty: "Carpentry",
        certificate: { Name: "Finish Carpentry & Millwork Certificate", IssuingOrganization: "Associated Builders and Contractors", Requirements: "OSHA 10 + 1 year carpentry experience", Specialty: "Carpentry", Hours: 24 },
      },
    ],
  },
];

// ── helpers ────────────────────────────────────────────────────────────────

function baseHeaders(sessionToken, useMaster = false) {
  return {
    "X-Parse-Application-Id":  APP_ID,
    ...(useMaster
      ? { "X-Parse-Master-Key": MASTER_KEY }
      : { "X-Parse-Javascript-Key": JS_KEY }),
    ...(sessionToken && !useMaster ? { "X-Parse-Session-Token": sessionToken } : {}),
    "Content-Type": "application/json",
  };
}

async function parsePost(path, body, sessionToken, useMaster = false) {
  const res  = await fetch(`${BASE}${path}`, {
    method:  "POST",
    headers: baseHeaders(sessionToken, useMaster),
    body:    JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

async function parsePut(path, body, sessionToken, useMaster = false) {
  const res  = await fetch(`${BASE}${path}`, {
    method:  "PUT",
    headers: baseHeaders(sessionToken, useMaster),
    body:    JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

async function parseGet(path, sessionToken, useMaster = false) {
  const res  = await fetch(`${BASE}${path}`, {
    method:  "GET",
    headers: baseHeaders(sessionToken, useMaster),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

async function signUpUser(data, role) {
  return parsePost("/users", {
    username:  data.email,
    email:     data.email,
    password:  SEED_PASSWORD,
    firstName: data.firstName,
    lastName:  data.lastName,
    role,
  });
}

async function loginUser(email) {
  return parseGet(
    `/login?username=${encodeURIComponent(email)}&password=${encodeURIComponent(SEED_PASSWORD)}`
  );
}

async function getOrCreateUser(data, role) {
  try {
    return await signUpUser(data, role);
  } catch (e) {
    if (e.message.toLowerCase().includes("already")) {
      return await loginUser(data.email);
    }
    throw e;
  }
}

async function setPublicRead(objectId, sessionToken) {
  return parsePut(`/users/${objectId}`, {
    ACL: { "*": { read: true }, [objectId]: { read: true, write: true } },
  }, sessionToken);
}

// Returns existing ContactInfo objectId for this email, or null if none.
async function findContactInfo(email) {
  const where = encodeURIComponent(JSON.stringify({ Email: email }));
  const res   = await parseGet(`/classes/ContactInfo?where=${where}&limit=1`, null, true);
  return res.results?.[0]?.objectId ?? null;
}

// Returns true if any Task already points to this ContactInfo objectId.
async function tasksExistFor(contactInfoId) {
  const where = encodeURIComponent(JSON.stringify({
    contact: { __type: "Pointer", className: "ContactInfo", objectId: contactInfoId },
  }));
  const res = await parseGet(`/classes/Tasks?where=${where}&limit=1`, null, true);
  return (res.results?.length ?? 0) > 0;
}

// ── main export ────────────────────────────────────────────────────────────

export async function seedAll(onProgress) {
  const results = [];

  const report = (name, status) => {
    results.push({ name, status });
    onProgress?.([...results]);
  };

  // Workers
  for (const data of WORKERS) {
    const label = `${data.firstName} ${data.lastName}`;
    try {
      const { objectId, sessionToken } = await getOrCreateUser(data, "worker");
      await setPublicRead(objectId, sessionToken);
      report(label, "✓ worker");
    } catch (e) {
      report(label, `✗ user: ${e.message}`);
    }
  }

  // Suppliers + ContactInfo + Tasks
  for (const data of SUPPLIERS) {
    const label = `${data.firstName} ${data.lastName}`;
    let objectId, sessionToken;

    // 1. Create or reuse _User
    try {
      ({ objectId, sessionToken } = await getOrCreateUser(data, "supplier"));
      await setPublicRead(objectId, sessionToken);
    } catch (e) {
      report(label, `✗ user: ${e.message}`);
      continue;
    }

    // 2. Create ContactInfo only if one doesn't already exist for this email
    let contactInfoId;
    try {
      const existing = await findContactInfo(data.email);
      if (existing) {
        contactInfoId = existing;
      } else {
        const ci = await parsePost("/classes/ContactInfo", {
          Name:             `${data.firstName} ${data.lastName}`,
          Email:            data.email,
          PhoneNumber:      data.phone,
          ServiceLocations: data.serviceLocations,
          contact: { __type: "Pointer", className: "_User", objectId },
        }, null, true);
        contactInfoId = ci.objectId;
      }
    } catch (e) {
      report(label, `✗ ContactInfo: ${e.message}`);
      continue;
    }

    // 3. Create Tasks + Certificates only if none exist yet for this ContactInfo
    let taskCount = 0;
    const taskErrors = [];
    const alreadySeeded = await tasksExistFor(contactInfoId).catch(() => false);
    if (alreadySeeded) {
      taskCount = data.tasks.length;
    } else {
      for (const task of data.tasks) {
        try {
          const { certificate, ...taskFields } = task;
          const cert = await parsePost("/classes/Certificates", certificate, null, true);
          await parsePost("/classes/Tasks", {
            ...taskFields,
            contact:        { __type: "Pointer", className: "ContactInfo", objectId: contactInfoId },
            Contact:        `${data.firstName} ${data.lastName}`,
            CertificateAid: { __type: "Pointer", className: "Certificates", objectId: cert.objectId },
          }, null, true);
          taskCount++;
        } catch (e) {
          taskErrors.push(`"${task.Description}": ${e.message}`);
        }
      }
    }

    const taskNote = taskErrors.length
      ? ` | ✗ ${taskErrors.join("; ")}`
      : "";
    report(label, `✓ supplier + contact + ${taskCount} task${taskCount !== 1 ? "s" : ""}${taskNote}`);
  }

  return results;
}
