"use client";

import { useState } from "react";
import { BRANCHES } from "@/lib/branches";
import { CITIES, DISTRICTS, INTERESTS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MemberFields({
  nickname = "",
  phone = "",
  city = "台北市",
  district = "大安區",
  interests = [],
  includeAccount = false,
  homeBranchId = "",
}: {
  nickname?: string;
  phone?: string;
  city?: string;
  district?: string;
  interests?: string[];
  includeAccount?: boolean;
  homeBranchId?: string;
}) {
  const initialCity = CITIES.includes(city as (typeof CITIES)[number]) ? (city as (typeof CITIES)[number]) : "台北市";
  const [currentCity, setCurrentCity] = useState<(typeof CITIES)[number]>(initialCity);
  const districts = DISTRICTS[currentCity];
  const districtValue = districts?.includes(district) ? district : (districts?.[0] ?? district);

  return (
    <div className="grid gap-4">
      {includeAccount ? (
        <>
          <div className="grid gap-2">
            <Label htmlFor="email">電子信箱</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密碼（至少 8 個字元）</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          </div>
        </>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="nickname">暱稱</Label>
        <Input id="nickname" name="nickname" defaultValue={nickname} maxLength={20} required autoComplete="nickname" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="city">縣市</Label>
          <select
            id="city"
            name="city"
            className="h-12 rounded-lg border border-input bg-card px-3"
            value={currentCity}
            onChange={(event) => setCurrentCity(event.target.value as (typeof CITIES)[number])}
          >
            {CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="district">行政區</Label>
          {districts ? (
            <select id="district" name="district" key={`${currentCity}-${districtValue}`} className="h-12 rounded-lg border border-input bg-card px-3" defaultValue={districtValue}>
              {districts.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          ) : (
            <Input id="district" name="district" key={currentCity} defaultValue={districtValue || ""} required placeholder="例如 北區" />
          )}
        </div>
      </div>
      <fieldset className="grid gap-2">
        <legend className="text-base font-medium">興趣（可複選）</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {INTERESTS.map((interest) => (
            <label key={interest} className="flex min-h-12 items-center gap-3 rounded-lg border px-3">
              <input
                type="checkbox"
                name="interests"
                value={interest}
                defaultChecked={interests.includes(interest)}
                className="size-6 accent-[#14603a]"
              />
              {interest}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-2">
        <Label htmlFor="home_branch_id">常去的上課場地（選填）</Label>
        <select id="home_branch_id" name="home_branch_id" defaultValue={homeBranchId} className="h-12 rounded-lg border border-input bg-card px-3">
          <option value="">尚未選擇</option>
          {BRANCHES.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.shortName} · {branch.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">電話（選填）</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={phone ?? ""} autoComplete="tel" placeholder="只有俱樂部聯絡時才使用" />
        <p className="text-base text-muted-foreground">我們不蒐集病歷、健檢報告或診斷。</p>
      </div>
    </div>
  );
}
