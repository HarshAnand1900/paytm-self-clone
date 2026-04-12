
type ProfileSectionProps = {
    name?: string | null;
    phone?: string | null;
};

export default function ProfileSection({name,phone}: ProfileSectionProps){
    return(
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p> UserName: {name || "No name"}</p>
          <p>Phone Number: {phone || "No phone"}</p>
        </div>
    )
}