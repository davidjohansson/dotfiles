#!/usr/bin/env bb
(import 'java.time.format.DateTimeFormatter
        'java.time.LocalDateTime)

(def now (LocalDateTime/now))
(def formatter (DateTimeFormatter/ofPattern "yyyy-MM-dd'T'HH:mm"))

(doseq [i (range -3 1)] 
  (println (.format (.. now (withHour 8)(withMinute 0)(plusDays i)) formatter))
  (println (.format (.. now (withHour 13)(withMinute 0)(plusDays i)) formatter))
  )
 
nil
