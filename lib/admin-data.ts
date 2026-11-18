import { ObjectId, type Filter } from "mongodb";
import clientPromise, { getMongoDbName } from "@/lib/mongodb-client";
import { connectDb } from "@/lib/mongoose";
import { Assessment } from "@/models/Assessment";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { Pet } from "@/models/Pet";
import { SupportMessage } from "@/models/SupportMessage";
import { WaitlistEntry } from "@/models/WaitlistEntry";

export const ADMIN_PAGE_SIZE = 25;

export type AdminProfileRow = {
  id: string;
  name: string;
  email: string;
  signInMethod: "password" | "google" | "unknown";
  emailVerified: string | null;
  createdAt: string | null;
  petCount: number;
  petsSummary: string;
  assessmentCount: number;
  latestScore: number | null;
};

export type AdminProfileDetail = AdminProfileRow & {
  image: string | null;
  pets: Array<{
    id: string;
    name: string;
    species: string;
    breed: string;
    createdAt: string | null;
  }>;
  assessments: Array<{
    id: string;
    petName: string;
    species: string;
    score: number;
    createdAt: string | null;
  }>;
};

type AuthUserLean = {
  _id: ObjectId;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | null;
  passwordHash?: string;
  createdAt?: Date;
};

function iso(value?: Date | string | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function usersCollection() {
  const client = await clientPromise;
  return client.db(getMongoDbName()).collection<AuthUserLean>("users");
}

async function accountsCollection() {
  const client = await clientPromise;
  return client.db(getMongoDbName()).collection<{ userId: ObjectId; provider: string }>("accounts");
}

async function signInMethodMap(userIds: ObjectId[]) {
  const map = new Map<string, "password" | "google" | "unknown">();
  if (!userIds.length) return map;

  const accounts = await (await accountsCollection())
    .find({ userId: { $in: userIds } }, { projection: { userId: 1, provider: 1 } })
    .toArray();

  for (const account of accounts) {
    const id = account.userId.toString();
    if (account.provider === "google") {
      map.set(id, "google");
    } else if (!map.has(id)) {
      map.set(id, "unknown");
    }
  }
  return map;
}

function resolveSignInMethod(
  user: AuthUserLean,
  providers: Map<string, "password" | "google" | "unknown">,
): "password" | "google" | "unknown" {
  if (user.passwordHash) return "password";
  return providers.get(user._id.toString()) || "unknown";
}

async function petAndAssessmentStats(userIds: string[]) {
  const petCount = new Map<string, number>();
  const petsSummary = new Map<string, string>();
  const assessmentCount = new Map<string, number>();
  const latestScore = new Map<string, number | null>();

  if (!userIds.length) {
    return { petCount, petsSummary, assessmentCount, latestScore };
  }

  await connectDb();

  const [pets, assessments] = await Promise.all([
    Pet.find({ userId: { $in: userIds } })
      .select("userId name species breed")
      .lean(),
    Assessment.find({ userId: { $in: userIds } })
      .select("userId score createdAt")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  for (const pet of pets) {
    const uid = String(pet.userId);
    petCount.set(uid, (petCount.get(uid) || 0) + 1);
    const label = [pet.name, pet.species, pet.breed].filter(Boolean).join(" · ");
    const prev = petsSummary.get(uid);
    petsSummary.set(uid, prev ? `${prev}; ${label}` : label);
  }

  for (const assessment of assessments) {
    const uid = String(assessment.userId || "");
    if (!uid) continue;
    assessmentCount.set(uid, (assessmentCount.get(uid) || 0) + 1);
    if (!latestScore.has(uid)) {
      latestScore.set(uid, typeof assessment.score === "number" ? assessment.score : null);
    }
  }

  return { petCount, petsSummary, assessmentCount, latestScore };
}

export async function getAdminCounts() {
  await connectDb();
  const users = await usersCollection();
  const [profiles, newsletter, waitlist, contact] = await Promise.all([
    users.countDocuments(),
    NewsletterSubscriber.countDocuments(),
    WaitlistEntry.countDocuments(),
    SupportMessage.countDocuments(),
  ]);
  return { profiles, newsletter, waitlist, contact };
}

export async function listAdminProfiles(opts: { q?: string; page?: number }) {
  const page = Math.max(1, opts.page || 1);
  const q = String(opts.q || "").trim();
  const filter: Filter<AuthUserLean> = {};
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ email: re }, { name: re }];
  }

  const col = await usersCollection();
  const total = await col.countDocuments(filter);
  const users = await col
    .find(filter, {
      projection: {
        name: 1,
        email: 1,
        emailVerified: 1,
        passwordHash: 1,
        createdAt: 1,
      },
    })
    .sort({ _id: -1 })
    .skip((page - 1) * ADMIN_PAGE_SIZE)
    .limit(ADMIN_PAGE_SIZE)
    .toArray();

  const ids = users.map((u) => u._id);
  const idStrings = ids.map((id) => id.toString());
  const [providers, stats] = await Promise.all([
    signInMethodMap(ids),
    petAndAssessmentStats(idStrings),
  ]);

  const rows: AdminProfileRow[] = users.map((user) => {
    const id = user._id.toString();
    return {
      id,
      name: user.name || "",
      email: user.email,
      signInMethod: resolveSignInMethod(user, providers),
      emailVerified: iso(user.emailVerified),
      createdAt: iso(user.createdAt) || iso(user._id.getTimestamp()),
      petCount: stats.petCount.get(id) || 0,
      petsSummary: stats.petsSummary.get(id) || "",
      assessmentCount: stats.assessmentCount.get(id) || 0,
      latestScore: stats.latestScore.get(id) ?? null,
    };
  });

  return { rows, total, page, pageSize: ADMIN_PAGE_SIZE };
}

export async function getAdminProfile(id: string): Promise<AdminProfileDetail | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await usersCollection();
  const user = await col.findOne(
    { _id: new ObjectId(id) },
    {
      projection: {
        name: 1,
        email: 1,
        image: 1,
        emailVerified: 1,
        passwordHash: 1,
        createdAt: 1,
      },
    },
  );
  if (!user) return null;

  await connectDb();
  const [providers, pets, assessments] = await Promise.all([
    signInMethodMap([user._id]),
    Pet.find({ userId: id }).select("name species breed createdAt").sort({ createdAt: -1 }).lean(),
    Assessment.find({ userId: id })
      .select("petName species score createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
  ]);

  const petRows = pets.map((pet) => ({
    id: String(pet._id),
    name: pet.name || "",
    species: pet.species || "",
    breed: pet.breed || "",
    createdAt: iso(pet.createdAt as Date | undefined),
  }));

  const assessmentRows = assessments.map((row) => ({
    id: String(row._id),
    petName: row.petName || "",
    species: row.species || "",
    score: typeof row.score === "number" ? row.score : 0,
    createdAt: iso(row.createdAt as Date | undefined),
  }));

  return {
    id: user._id.toString(),
    name: user.name || "",
    email: user.email,
    image: user.image || null,
    signInMethod: resolveSignInMethod(user, providers),
    emailVerified: iso(user.emailVerified),
    createdAt: iso(user.createdAt) || iso(user._id.getTimestamp()),
    petCount: petRows.length,
    petsSummary: petRows.map((p) => [p.name, p.species, p.breed].filter(Boolean).join(" · ")).join("; "),
    assessmentCount: assessmentRows.length,
    latestScore: assessmentRows[0]?.score ?? null,
    pets: petRows,
    assessments: assessmentRows,
  };
}

export async function listAllAdminProfilesForExport() {
  const col = await usersCollection();
  const users = await col
    .find(
      {},
      {
        projection: {
          name: 1,
          email: 1,
          emailVerified: 1,
          passwordHash: 1,
          createdAt: 1,
        },
      },
    )
    .sort({ _id: -1 })
    .toArray();

  const ids = users.map((u) => u._id);
  const idStrings = ids.map((id) => id.toString());
  const [providers, stats] = await Promise.all([
    signInMethodMap(ids),
    petAndAssessmentStats(idStrings),
  ]);

  await connectDb();
  const [pets, assessments] = await Promise.all([
    Pet.find({ userId: { $in: idStrings } })
      .select("userId name species breed gender city createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    Assessment.find({ userId: { $in: idStrings } })
      .select("userId ownerEmail petName species score createdAt")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const accounts = users.map((user) => {
    const id = user._id.toString();
    return {
      id,
      name: user.name || "",
      email: user.email,
      signInMethod: resolveSignInMethod(user, providers),
      emailVerified: iso(user.emailVerified),
      createdAt: iso(user.createdAt) || iso(user._id.getTimestamp()),
      petCount: stats.petCount.get(id) || 0,
      assessmentCount: stats.assessmentCount.get(id) || 0,
      latestScore: stats.latestScore.get(id) ?? null,
    };
  });

  return {
    accounts,
    pets: pets.map((pet) => ({
      id: String(pet._id),
      userId: String(pet.userId),
      name: pet.name || "",
      species: pet.species || "",
      breed: pet.breed || "",
      gender: pet.gender || "",
      city: pet.city || "",
      createdAt: iso(pet.createdAt as Date | undefined),
    })),
    assessments: assessments.map((row) => ({
      id: String(row._id),
      userId: String(row.userId || ""),
      ownerEmail: row.ownerEmail || "",
      petName: row.petName || "",
      species: row.species || "",
      score: typeof row.score === "number" ? row.score : 0,
      createdAt: iso(row.createdAt as Date | undefined),
    })),
  };
}

export async function listNewsletter(opts: { q?: string; status?: string; page?: number }) {
  await connectDb();
  const page = Math.max(1, opts.page || 1);
  const q = String(opts.q || "").trim();
  const status = String(opts.status || "").trim();
  const filter: Record<string, unknown> = {};
  if (q) filter.email = new RegExp(escapeRegex(q), "i");
  if (status === "pending" || status === "subscribed") filter.status = status;

  const [total, rows] = await Promise.all([
    NewsletterSubscriber.countDocuments(filter),
    NewsletterSubscriber.find(filter)
      .select("email status consentedAt createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
  ]);

  return {
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    rows: rows.map((row) => ({
      id: String(row._id),
      email: row.email,
      status: row.status,
      consentedAt: iso(row.consentedAt as Date | undefined),
      createdAt: iso(row.createdAt as Date | undefined),
      updatedAt: iso(row.updatedAt as Date | undefined),
    })),
  };
}

export async function getNewsletter(id: string) {
  if (!ObjectId.isValid(id)) return null;
  await connectDb();
  const row = await NewsletterSubscriber.findById(id)
    .select("email status consentedAt createdAt updatedAt")
    .lean();
  if (!row) return null;
  return {
    id: String(row._id),
    email: row.email,
    status: row.status,
    consentedAt: iso(row.consentedAt as Date | undefined),
    createdAt: iso(row.createdAt as Date | undefined),
    updatedAt: iso(row.updatedAt as Date | undefined),
  };
}

export async function listAllNewsletterForExport() {
  await connectDb();
  const rows = await NewsletterSubscriber.find({})
    .select("email status consentedAt createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
  return rows.map((row) => ({
    id: String(row._id),
    email: row.email,
    status: row.status,
    consentedAt: iso(row.consentedAt as Date | undefined),
    createdAt: iso(row.createdAt as Date | undefined),
    updatedAt: iso(row.updatedAt as Date | undefined),
  }));
}

export async function listWaitlist(opts: { q?: string; page?: number }) {
  await connectDb();
  const page = Math.max(1, opts.page || 1);
  const q = String(opts.q || "").trim();
  const filter: Record<string, unknown> = {};
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ email: re }, { name: re }, { city: re }, { petType: re }, { plan: re }];
  }

  const [total, rows] = await Promise.all([
    WaitlistEntry.countDocuments(filter),
    WaitlistEntry.find(filter)
      .select("name email country city petType plan createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
  ]);

  return {
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    rows: rows.map((row) => ({
      id: String(row._id),
      name: row.name || "",
      email: row.email,
      country: row.country || "",
      city: row.city || "",
      petType: row.petType || "",
      plan: row.plan || "",
      createdAt: iso(row.createdAt as Date | undefined),
      updatedAt: iso(row.updatedAt as Date | undefined),
    })),
  };
}

export async function getWaitlist(id: string) {
  if (!ObjectId.isValid(id)) return null;
  await connectDb();
  const row = await WaitlistEntry.findById(id)
    .select("name email country city petType plan createdAt updatedAt")
    .lean();
  if (!row) return null;
  return {
    id: String(row._id),
    name: row.name || "",
    email: row.email,
    country: row.country || "",
    city: row.city || "",
    petType: row.petType || "",
    plan: row.plan || "",
    createdAt: iso(row.createdAt as Date | undefined),
    updatedAt: iso(row.updatedAt as Date | undefined),
  };
}

export async function listAllWaitlistForExport() {
  await connectDb();
  const rows = await WaitlistEntry.find({})
    .select("name email country city petType plan createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
  return rows.map((row) => ({
    id: String(row._id),
    name: row.name || "",
    email: row.email,
    country: row.country || "",
    city: row.city || "",
    petType: row.petType || "",
    plan: row.plan || "",
    createdAt: iso(row.createdAt as Date | undefined),
    updatedAt: iso(row.updatedAt as Date | undefined),
  }));
}

export async function listContact(opts: { q?: string; page?: number }) {
  await connectDb();
  const page = Math.max(1, opts.page || 1);
  const q = String(opts.q || "").trim();
  const filter: Record<string, unknown> = {};
  if (q) {
    const re = new RegExp(escapeRegex(q), "i");
    filter.$or = [
      { email: re },
      { firstName: re },
      { lastName: re },
      { subject: re },
      { city: re },
      { message: re },
    ];
  }

  const [total, rows] = await Promise.all([
    SupportMessage.countDocuments(filter),
    SupportMessage.find(filter)
      .select("firstName lastName email phone city subject message createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * ADMIN_PAGE_SIZE)
      .limit(ADMIN_PAGE_SIZE)
      .lean(),
  ]);

  return {
    total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    rows: rows.map((row) => ({
      id: String(row._id),
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email,
      phone: row.phone || "",
      city: row.city || "",
      subject: row.subject || "",
      message: row.message || "",
      createdAt: iso(row.createdAt as Date | undefined),
    })),
  };
}

export async function getContact(id: string) {
  if (!ObjectId.isValid(id)) return null;
  await connectDb();
  const row = await SupportMessage.findById(id)
    .select("firstName lastName email phone city subject message createdAt updatedAt")
    .lean();
  if (!row) return null;
  return {
    id: String(row._id),
    firstName: row.firstName || "",
    lastName: row.lastName || "",
    email: row.email,
    phone: row.phone || "",
    city: row.city || "",
    subject: row.subject || "",
    message: row.message || "",
    createdAt: iso(row.createdAt as Date | undefined),
    updatedAt: iso(row.updatedAt as Date | undefined),
  };
}

export async function listAllContactForExport() {
  await connectDb();
  const rows = await SupportMessage.find({})
    .select("firstName lastName email phone city subject message createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
  return rows.map((row) => ({
    id: String(row._id),
    firstName: row.firstName || "",
    lastName: row.lastName || "",
    email: row.email,
    phone: row.phone || "",
    city: row.city || "",
    subject: row.subject || "",
    message: row.message || "",
    createdAt: iso(row.createdAt as Date | undefined),
    updatedAt: iso(row.updatedAt as Date | undefined),
  }));
}
