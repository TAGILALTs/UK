export function GoogleMap() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.4965281028772!2d65.44129612890968!3d57.16698319312849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43bbe26bb8c74911%3A0x1752819d423a3d00!2z0JjQvdGB0YLQuNGC0YPRgtGB0LrQsNGPINGD0LsuLCA20LozLCDQotGO0LzQtdC90YwsINCi0Y7QvNC10L3RgdC60LDRjyDQvtCx0LsuLCA2MjUwNDE!5e1!3m2!1sru!2sru!4v1735746542593!5m2!1sru!2sru"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
