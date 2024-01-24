import type {
  Action,
  BytesType,
  Float32Type,
  Float64Type,
  Int16Type,
  Int32Type,
  Int64Type,
  Int8Type,
  NameType,
  PublicKeyType,
  SignatureType,
  UInt16Type,
  UInt32Type,
  UInt64Type,
  UInt8Type
} from "@wharfkit/antelope"
import {
  ABI,
  Asset,
  Blob,
  Bytes,
  Float32,
  Float64,
  Int16,
  Int32,
  Int64,
  Int8,
  Name,
  PublicKey,
  Signature,
  Struct,
  UInt16,
  UInt32,
  UInt64,
  UInt8,
  Variant
} from "@wharfkit/antelope"
import type { ActionOptions, ContractArgs, PartialBy, Table } from "@wharfkit/contract"
import { Contract as BaseContract } from "@wharfkit/contract"
export const abiBlob = Blob.from(
  "DmVvc2lvOjphYmkvMS4yAF0HQWNjb3VudAAKB2JvaWRfaWQEbmFtZQZvd25lcnMGbmFtZVtdBGF1dGgLQWNjb3VudEF1dGgIc3BvbnNvcnMGbmFtZVtdBXN0YWtlDEFjY291bnRTdGFrZQVwb3dlcgxBY2NvdW50UG93ZXIEdGVhbQtBY2NvdW50VGVhbQdiYWxhbmNlBnVpbnQzMgtuZnRfYmFsYW5jZQZ1aW50MTYLcmVjb3ZlcmFibGUEYm9vbAtBY2NvdW50QXV0aAACBGtleXMMcHVibGljX2tleVtdBW5vbmNlBXVpbnQ4DkFjY291bnRCb29zdGVyAAQOcHdyX211bHRpcGxpZXIFdWludDgRcHdyX2FkZF9wZXJfcm91bmQGdWludDE2DWV4cGlyZXNfcm91bmQGdWludDE2F2FnZ3JlZ2F0ZV9wd3JfcmVtYWluaW5nBnVpbnQzMg1BY2NvdW50Q3JlYXRlAAMHYm9pZF9pZARuYW1lBGtleXMMcHVibGljX2tleVtdBm93bmVycwZuYW1lW10MQWNjb3VudFBvd2VyAAUSbGFzdF9jbGFpbWVkX3JvdW5kBnVpbnQxNhBsYXN0X2FkZGVkX3JvdW5kBnVpbnQxNgZyYXRpbmcGdWludDE2B2hpc3RvcnkIdWludDE2W10EbW9kcxBBY2NvdW50Qm9vc3RlcltdDEFjY291bnRTdGFrZQADCXVuc3Rha2luZw5Ub2tlblVuc3Rha2VbXQtzZWxmX3N0YWtlZAZ1aW50MzIYcmVjZWl2ZWRfZGVsZWdhdGVkX3N0YWtlBnVpbnQxNgtBY2NvdW50VGVhbQAEB3RlYW1faWQFdWludDgPbGFzdF9lZGl0X3JvdW5kBnVpbnQxNg10ZWFtX3RheF9tdWx0BXVpbnQ4HHRlYW1fY3VtdWxhdGl2ZV9jb250cmlidXRpb24GdWludDMyCEFjY3RNZXRhAAIHYm9pZF9pZARuYW1lBG1ldGEFYnl0ZXMGQWN0aW9uAAQHYWNjb3VudARuYW1lBG5hbWUEbmFtZQ1hdXRob3JpemF0aW9uEVBlcm1pc3Npb25MZXZlbFtdBGRhdGEFYnl0ZXMPQXRvbWljQXR0cmlidXRlAAIDa2V5BnN0cmluZwV2YWx1ZQtBdG9taWNWYWx1ZQxBdG9taWNGb3JtYXQAAgRuYW1lBnN0cmluZwR0eXBlBnN0cmluZwRBdXRoAAEMYm9pZF9pZF9hdXRoBG5hbWUHQm9vc3RlcgAFCmJvb3N0ZXJfaWQFdWludDgOcHdyX211bHRpcGxpZXIFdWludDgRcHdyX2FkZF9wZXJfcm91bmQGdWludDE2G2V4cGlyZV9hZnRlcl9lbGFwc2VkX3JvdW5kcwZ1aW50MTYWYWdncmVnYXRlX3B3cl9jYXBhY2l0eQZ1aW50MzIGQ29uZmlnAAwHYWNjb3VudA1Db25maWdBY2NvdW50BXBvd2VyC0NvbmZpZ1Bvd2VyBG1pbnQKQ29uZmlnTWludAR0ZWFtCkNvbmZpZ1RlYW0Fc3Rha2ULQ29uZmlnU3Rha2UEdGltZQpDb25maWdUaW1lBGF1dGgKQ29uZmlnQXV0aANuZnQJQ29uZmlnTmZ0BnBhdXNlZARib29sDmFsbG93X2RlcG9zaXRzBGJvb2wRYWxsb3dfd2l0aGRyYXdhbHMEYm9vbA9yZWNvdmVyeUFjY291bnQEbmFtZQ1Db25maWdBY2NvdW50AAkMaW52aXRlX3ByaWNlBnVpbnQzMhZwcmVtaXVtX3B1cmNoYXNlX3ByaWNlBnVpbnQzMhJtYXhfcHJlbWl1bV9wcmVmaXgFdWludDgKbWF4X293bmVycwV1aW50OAxtYXhfYm9vc3RlcnMFdWludDgQc3VmZml4X3doaXRlbGlzdAZuYW1lW10UcmVtb3ZlX3Nwb25zb3JfcHJpY2UGdWludDMyGHNwb25zb3JfbWF4X2ludml0ZV9jb2RlcwV1aW50OBlpbnZpdGVfY29kZV9leHBpcmVfcm91bmRzBnVpbnQxNgpDb25maWdBdXRoAAUVa2V5X2FjdGlvbnNfd2hpdGVsaXN0Bm5hbWVbXRVrZXlfYWNjb3VudF9tYXhfc3Rha2UGdWludDMyF2tleV9hY2NvdW50X21heF9iYWxhbmNlBnVpbnQzMhBhY2NvdW50X21heF9rZXlzBXVpbnQ4Gndvcmtlcl9tYXhfYmlsbF9wZXJfYWN0aW9uBnVpbnQzMgpDb25maWdNaW50AAIYcm91bmRfcG93ZXJlZF9zdGFrZV9tdWx0B2Zsb2F0MzIQcm91bmRfcG93ZXJfbXVsdAdmbG9hdDMyCUNvbmZpZ05mdAACFGJvaWRfaWRfbWF4aW11bV9uZnRzBnVpbnQxNhV3aGl0ZWxpc3RfY29sbGVjdGlvbnMGbmFtZVtdC0NvbmZpZ1Bvd2VyAAUQc3BvbnNvcl90YXhfbXVsdAdmbG9hdDMyEnBvd2VyZWRfc3Rha2VfbXVsdAdmbG9hdDMyHGNsYWltX21heGltdW1fZWxhcHNlZF9yb3VuZHMGdWludDE2EHNvZnRfbWF4X3B3cl9hZGQGdWludDE2FGhpc3Rvcnlfc2xvdHNfbGVuZ3RoBXVpbnQ4C0NvbmZpZ1N0YWtlAAIOdW5zdGFrZV9yb3VuZHMFdWludDgdZXh0cmFfc3Rha2VfbWluX2xvY2tlZF9yb3VuZHMFdWludDgKQ29uZmlnVGVhbQAGEWNoYW5nZV9taW5fcm91bmRzBnVpbnQxNhRlZGl0X3RlYW1fbWluX3JvdW5kcwZ1aW50MTYYdGVhbV9lZGl0X21heF9wY3RfY2hhbmdlBnVpbnQxNg1idXlfdGVhbV9jb3N0BnVpbnQzMhRvd25lcl9zdGFrZV9yZXF1aXJlZAZ1aW50MzInb3duZXJfZnV0dXJlX3N0YWtlX2xvY2tfcm91bmRzX3JlcXVpcmVkBnVpbnQxNgpDb25maWdUaW1lAAIccm91bmRzX3N0YXJ0X3NlY19zaW5jZV9lcG9jaAZ1aW50MzIQcm91bmRfbGVuZ3RoX3NlYwZ1aW50MzIORXh0ZW5kZWRTeW1ib2wAAgNzeW0Gc3ltYm9sCGNvbnRyYWN0BG5hbWUGR2xvYmFsAAMKY2hhaW5fbmFtZQRuYW1lC3RvdGFsX3Bvd2VyBnVpbnQ2NBtsYXN0X2luZmxhdGlvbl9hZGp1c3Rfcm91bmQGdWludDE2Bkludml0ZQADC2ludml0ZV9jb2RlBnVpbnQ2NANrZXkKcHVibGljX2tleQ1jcmVhdGVkX3JvdW5kBnVpbnQxNgdNaW50TG9nAAcKcG93ZXJfbWludAZ1aW50MzIScG93ZXJlZF9zdGFrZV9taW50BnVpbnQzMg5hY2NvdW50X2Vhcm5lZAZ1aW50MzIIdGVhbV9jdXQGdWludDMyEXRlYW1fb3duZXJfZWFybmVkBnVpbnQzMg5vdmVyc3Rha2VfbWludAZ1aW50MzIFdG90YWwGdWludDMyA05GVAACCGFzc2V0X2lkBnVpbnQ2NBJsb2NrZWRfdW50aWxfcm91bmQGdWludDE2B05GVE1pbnQAAhVtaW50X3JlY2VpdmVyX2JvaWRfaWQEbmFtZRdtaW50X3F1YW50aXR5X3JlbWFpbmluZwZ1aW50MTYJTmZ0QWN0aW9uAAcPY29sbGVjdGlvbl9uYW1lBG5hbWULc2NoZW1hX25hbWUEbmFtZQt0ZW1wbGF0ZV9pZAVpbnQzMhptYXRjaF9pbW11dGFibGVfYXR0cmlidXRlcxFBdG9taWNBdHRyaWJ1dGVbXRhtYXRjaF9tdXRhYmxlX2F0dHJpYnV0ZXMRQXRvbWljQXR0cmlidXRlW10EYnVybgRib29sC2xvY2tfcm91bmRzBnVpbnQxNgdOZnRNaW50AAYQbWludF90ZW1wbGF0ZV9pZAVpbnQzMhBtaW50X3NjaGVtYV9uYW1lBG5hbWUUbWludF9jb2xsZWN0aW9uX25hbWUEbmFtZQ5pbW11dGFibGVfZGF0YRFBdG9taWNBdHRyaWJ1dGVbXQxtdXRhYmxlX2RhdGERQXRvbWljQXR0cmlidXRlW10IcXVhbnRpdHkFdWludDgFT2ZmZXIABghvZmZlcl9pZAZ1aW50NjQMcmVxdWlyZW1lbnRzEU9mZmVyUmVxdWlyZW1lbnRzB2FjdGlvbnMLT2ZmZXJBY3Rpb24HcmV3YXJkcwxPZmZlclJld2FyZHMGbGltaXRzC09mZmVyTGltaXRzDXRvdGFsX2NsYWltZWQGdWludDMyC09mZmVyQWN0aW9uAAQPZGVsZWdhdGVkX3N0YWtlBnVpbnQxNh5zdGFrZV9sb2NrZWRfYWRkaXRpb25hbF9yb3VuZHMGdWludDE2C25mdF9hY3Rpb25zC05mdEFjdGlvbltdD2JhbGFuY2VfcGF5bWVudAZ1aW50MzILT2ZmZXJMaW1pdHMAAhhvZmZlcl9xdWFudGl0eV9yZW1haW5pbmcGdWludDMyFWF2YWlsYWJsZV91bnRpbF9yb3VuZAZ1aW50MTYRT2ZmZXJSZXF1aXJlbWVudHMABQd0ZWFtX2lkBWJ5dGVzCW1pbl9wb3dlcgZ1aW50MTYLbWluX2JhbGFuY2UGdWludDMyCW1pbl9zdGFrZQZ1aW50MzIgbWluX2N1bXVsYXRpdmVfdGVhbV9jb250cmlidXRpb24GdWludDMyDE9mZmVyUmV3YXJkcwAFCW5mdF9taW50cwlOZnRNaW50W10PYmFsYW5jZV9kZXBvc2l0BnVpbnQzMg9kZWxlZ2F0ZWRfc3Rha2UGdWludDE2HnN0YWtlX2xvY2tlZF9hZGRpdGlvbmFsX3JvdW5kcwZ1aW50MTYUYWN0aXZhdGVfYm9vc3Rlcl9pZHMFYnl0ZXMPUGVybWlzc2lvbkxldmVsAAIFYWN0b3IEbmFtZQpwZXJtaXNzaW9uBG5hbWUNUG93ZXJDbGFpbUxvZwAEBmJlZm9yZQZ1aW50MzIFYWZ0ZXIGdWludDMyDWZyb21fYm9vc3RlcnMGdWludDMyDmVsYXBzZWRfcm91bmRzBnVpbnQxNgdTcG9uc29yAAYPc3BvbnNvcl9ib2lkX2lkBG5hbWUPaW52aXRlc19iYWxhbmNlBnVpbnQxNhZpbnZpdGVfY29kZXNfdW5jbGFpbWVkBnVpbnQxNhRpbnZpdGVfY29kZXNfY2xhaW1lZAZ1aW50MzISc3BvbnNvcmVkX3VwZ3JhZGVzBnVpbnQzMhV1cGdyYWRlc190b3RhbF9lYXJuZWQGdWludDMyBVN0YWtlAAUIc3Rha2VfaWQGdWludDY0DGZyb21fYm9pZF9pZARuYW1lCnRvX2JvaWRfaWQEbmFtZQ5zdGFrZV9xdWFudGl0eQZ1aW50MTYSbG9ja2VkX3VudGlsX3JvdW5kBnVpbnQxNgRUZWFtAAwHdGVhbV9pZAZ1aW50MTYHYmFsYW5jZQZ1aW50MzIFc3Rha2UMQWNjb3VudFN0YWtlBW93bmVyBG5hbWUIbWFuYWdlcnMGbmFtZVtdEG1pbl9wd3JfdGF4X211bHQFdWludDgOb3duZXJfY3V0X211bHQFdWludDgNdXJsX3NhZmVfbmFtZQZzdHJpbmcFcG93ZXIGdWludDY0B21lbWJlcnMGdWludDMyD2xhc3RfZWRpdF9yb3VuZAZ1aW50MTYEbWV0YQVieXRlcwxUb2tlblVuc3Rha2UAAhZyZWRlZW1hYmxlX2FmdGVyX3JvdW5kBnVpbnQxNghxdWFudGl0eQZ1aW50MzILYWNjb3VudC5hZGQABAdib2lkX2lkBG5hbWUGb3duZXJzBm5hbWVbXQhzcG9uc29ycwZuYW1lW10Ea2V5cwxwdWJsaWNfa2V5W10LYWNjb3VudC5idXkAAg1wYXllcl9ib2lkX2lkBG5hbWULbmV3X2FjY291bnQNQWNjb3VudENyZWF0ZQxhY2NvdW50LmVkaXQAAgdib2lkX2lkBG5hbWUEbWV0YQVieXRlcwxhY2NvdW50LmZyZWUAAQdib2lkX2lkBG5hbWUKYWNjb3VudC5ybQABB2JvaWRfaWQEbmFtZQRhdXRoAAUHYm9pZF9pZARuYW1lB2FjdGlvbnMIQWN0aW9uW10Dc2lnCXNpZ25hdHVyZQhrZXlJbmRleAVpbnQzMg9leHBpcmVzX3V0Y19zZWMGdWludDMyC2F1dGguYWRka2V5AAIHYm9pZF9pZARuYW1lA2tleQpwdWJsaWNfa2V5CWF1dGguaW5pdAAACmF1dGgucm1rZXkAAgdib2lkX2lkBG5hbWUIa2V5SW5kZXgFaW50MzILYm9vc3Rlci5hZGQAAgdib2lkX2lkBG5hbWUKYm9vc3Rlcl9pZAV1aW50OAtib29zdGVyLm5ldwABB2Jvb3N0ZXIHQm9vc3Rlcgpib29zdGVyLnJtAAIHYm9pZF9pZARuYW1lDWJvb3N0ZXJfaW5kZXgHaW50MzJbXQxjb25maWcuY2xlYXIAAApjb25maWcuc2V0AAEGY29uZmlnBkNvbmZpZwxnbG9iYWwuY2hhaW4AAQpjaGFpbl9uYW1lBG5hbWUMZ2xvYmFsLmNsZWFyAAAKZ2xvYmFsLnNldAABCmdsb2JhbERhdGEGR2xvYmFsDGludGVybmFseGZlcgAEDGZyb21fYm9pZF9pZARuYW1lCnRvX2JvaWRfaWQEbmFtZQhxdWFudGl0eQZ1aW50MzIEbWVtbwZzdHJpbmcKaW52aXRlLmFkZAADB2JvaWRfaWQEbmFtZQtpbnZpdGVfY29kZQZ1aW50NjQDa2V5CnB1YmxpY19rZXkKaW52aXRlLmJ1eQACB2JvaWRfaWQEbmFtZQhxdWFudGl0eQZ1aW50MTYMaW52aXRlLmNsYWltAAQPc3BvbnNvcl9ib2lkX2lkBG5hbWULaW52aXRlX2NvZGUGdWludDY0A3NpZwlzaWduYXR1cmULbmV3X2FjY291bnQNQWNjb3VudENyZWF0ZQlpbnZpdGUucm0AAg9zcG9uc29yX2JvaWRfaWQEbmFtZQtpbnZpdGVfY29kZQZ1aW50NjQJbG9ncHdyYWRkAAYHYm9pZF9pZARuYW1lCHJlY2VpdmVkBnVpbnQxNg5mcm9tX211bHRfbW9kcwZ1aW50MTYTZGl2ZXJ0ZWRfdG9fc3BvbnNvcgZ1aW50MTYPcG93ZXJfaW5jcmVhc2VkBnVpbnQxNgVvcmlnbgRuYW1lC2xvZ3B3cmNsYWltAAMHYm9pZF9pZARuYW1lBXBvd2VyDVBvd2VyQ2xhaW1Mb2cEbWludAdNaW50TG9nBG1pbnQAAgJ0bwRuYW1lDndob2xlX3F1YW50aXR5BnVpbnQzMghuZnQubG9jawADB2JvaWRfaWQEbmFtZQhhc3NldF9pZAZ1aW50NjQSbG9ja2VkX3VudGlsX3JvdW5kBnVpbnQxNgxuZnQucmVjZWl2ZXIAAgdib2lkX2lkBG5hbWUNbWludF9xdWFudGl0eQZ1aW50MTYMbmZ0LndpdGhkcmF3AAMHYm9pZF9pZARuYW1lCWFzc2V0X2lkcwh1aW50NjRbXQJ0bwRuYW1lCG5mdC54ZmVyAAMMZnJvbV9ib2lkX2lkBG5hbWUKdG9fYm9pZF9pZARuYW1lCWFzc2V0X2lkcwh1aW50NjRbXQlvZmZlci5hZGQABAxyZXF1aXJlbWVudHMRT2ZmZXJSZXF1aXJlbWVudHMHYWN0aW9ucwtPZmZlckFjdGlvbgdyZXdhcmRzDE9mZmVyUmV3YXJkcwZsaW1pdHMLT2ZmZXJMaW1pdHMLb2ZmZXIuY2xhaW0AAwdib2lkX2lkBG5hbWUIb2ZmZXJfaWQGdWludDY0F3JlcXVpcmVkX25mdF9hY3Rpb25faWRzCHVpbnQ2NFtdC29mZmVyLmNsZWFuAAAIb2ZmZXIucm0AAQhvZmZlcl9pZAZ1aW50NjQJb3duZXIuYWRkAAIHYm9pZF9pZARuYW1lBW93bmVyBG5hbWUIb3duZXIucm0AAgdib2lkX2lkBG5hbWUFb3duZXIEbmFtZQlwb3dlci5hZGQAAgdib2lkX2lkBG5hbWUFcG93ZXIGdWludDE2C3Bvd2VyLmNsYWltAAEHYm9pZF9pZARuYW1lCnNwb25zb3Iucm0AAQ9zcG9uc29yX2JvaWRfaWQEbmFtZQtzcG9uc29yLnNldAABA3JvdwdTcG9uc29yBXN0YWtlAAIHYm9pZF9pZARuYW1lCHF1YW50aXR5BnVpbnQzMgtzdGFrZS5kZWxlZwAEDGZyb21fYm9pZF9pZARuYW1lCnRvX2JvaWRfaWQEbmFtZQ5zdGFrZV9xdWFudGl0eQZ1aW50MTYQbG9ja191bnRpbF9yb3VuZAZ1aW50MTYLdGVhbS5jaGFuZ2UAAwdib2lkX2lkBG5hbWULbmV3X3RlYW1faWQFdWludDgQbmV3X3B3cl90YXhfbXVsdAV1aW50OAt0ZWFtLmNyZWF0ZQAEBW93bmVyBG5hbWUQbWluX3B3cl90YXhfbXVsdAV1aW50OA5vd25lcl9jdXRfbXVsdAV1aW50OA11cmxfc2FmZV9uYW1lBnN0cmluZwl0ZWFtLmVkaXQABwd0ZWFtX2lkBXVpbnQ4BW93bmVyBG5hbWUIbWFuYWdlcnMGbmFtZVtdEG1pbl9wd3JfdGF4X211bHQFdWludDgOb3duZXJfY3V0X211bHQFdWludDgNdXJsX3NhZmVfbmFtZQZzdHJpbmcEbWV0YQVieXRlcwd0ZWFtLnJtAAEHdGVhbV9pZAV1aW50OAx0ZWFtLnRheHJhdGUAAgdib2lkX2lkBG5hbWUQbmV3X3B3cl90YXhfbXVsdAV1aW50OAl0aGlzcm91bmQAAAt1bnN0YWtlLmVuZAABB2JvaWRfaWQEbmFtZQx1bnN0YWtlLmluaXQAAgdib2lkX2lkBG5hbWUIcXVhbnRpdHkGdWludDMyDHVuc3Rha2Uuc3RvcAABB2JvaWRfaWQEbmFtZQx1bnN0a2UuZGVsZWcAAQhzdGFrZV9pZAZ1aW50NjQId2l0aGRyYXcAAwdib2lkX2lkBG5hbWUIcXVhbnRpdHkGdWludDMyAnRvBG5hbWU0AFIyIE9NETILYWNjb3VudC5hZGQAALw+IE9NETILYWNjb3VudC5idXkAkF1SIE9NETIMYWNjb3VudC5lZGl0AKDUXSBPTREyDGFjY291bnQuZnJlZQAAgLwgT00RMgphY2NvdW50LnJtAAAAAAAA0LI2BGF1dGgAALyCKRnQsjYLYXV0aC5hZGRrZXkAAADIbjrQsjYJYXV0aC5pbml0AACAV1Be0LI2CmF1dGgucm1rZXkAAFIy4KqMKT0LYm9vc3Rlci5hZGQAALia4KqMKT0LYm9vc3Rlci5uZXcAAIC84KqMKT0KYm9vc3Rlci5ybQBwjYoIMLcmRQxjb25maWcuY2xlYXIAAEBWGDC3JkUKY29uZmlnLnNldAAwnWkIRHNoZAxnbG9iYWwuY2hhaW4AcI2KCERzaGQMZ2xvYmFsLmNsZWFyAABAVhhEc2hkCmdsb2JhbC5zZXQAcNXq0cyr8nQMaW50ZXJuYWx4ZmVyAABASgao7PZ0Cmludml0ZS5hZGQAAIDXB6js9nQKaW52aXRlLmJ1eQAgnYkIqOz2dAxpbnZpdGUuY2xhaW0AAACQF6js9nQJaW52aXRlLnJtAAAASMlcXhmNCWxvZ3B3cmFkZAAApDMRXV4ZjQtsb2dwd3JjbGFpbQAAAAAAAJCnkwRtaW50AAAAABDRCPKaCG5mdC5sb2NrAHDVdgqpC/KaDG5mdC5yZWNlaXZlcgDAzU0tOw7ymgxuZnQud2l0aGRyYXcAAAAAV60O8poIbmZ0LnhmZXIAAABIyYCr1qIJb2ZmZXIuYWRkAACkMxGBq9aiC29mZmVyLmNsYWltAACmURGBq9aiC29mZmVyLmNsZWFuAAAAAPKCq9aiCG9mZmVyLnJtAAAASMmAqyanCW93bmVyLmFkZAAAAADygqsmpwhvd25lci5ybQAAAEjJgKs4rQlwb3dlci5hZGQAAKQzEYGrOK0LcG93ZXIuY2xhaW0AAIC84FI8acUKc3BvbnNvci5ybQAAssLgUjxpxQtzcG9uc29yLnNldAAAAAAAAAVNxgVzdGFrZQAAmIoqAQVNxgtzdGFrZS5kZWxlZwAAFJumISCNygt0ZWFtLmNoYW5nZQAAVDbqIiCNygt0ZWFtLmNyZWF0ZQAAAMguKSCNygl0ZWFtLmVkaXQAAAAAQF4gjcoHdGVhbS5ybQCgsrndZCCNygx0ZWFtLnRheHJhdGUAAABIU9OLXcsJdGhpc3JvdW5kAADSVEBBk/HUC3Vuc3Rha2UuZW5kAJDddEBBk/HUDHVuc3Rha2UuaW5pdABQacZAQZPx1Ax1bnN0YWtlLnN0b3AAwFRUCSiY8dQMdW5zdGtlLmRlbGVnAAAAANzc1LLjCHdpdGhkcmF3AA0AAAA4T00RMgNpNjQAAAdBY2NvdW50AAAAJiuZETIDaTY0AAAIQWNjdE1ldGEAAAAAANCyNgNpNjQAAARBdXRoAAAA+KqMKT0DaTY0AAAHQm9vc3RlcgAAAAAwtyZFA2k2NAAABkNvbmZpZwAAAABEc2hkA2k2NAAABkdsb2JhbAAAAACr7PZ0A2k2NAAABkludml0ZQAAACBPJ/OaA2k2NAAAB05GVE1pbnQAAAAAAIDzmgNpNjQAAANORlQAAAAA4KvWogNpNjQAAAVPZmZlcgAAAPhSPGnFA2k2NAAAB1Nwb25zb3IAAAAAYAVNxgNpNjQAAAVTdGFrZQAAAAAALI3KA2k2NAAABFRlYW0AAAABC0F0b21pY1ZhbHVlFgRpbnQ4BWludDE2BWludDMyBWludDY0BXVpbnQ4BnVpbnQxNgZ1aW50MzIGdWludDY0B2Zsb2F0MzIHZmxvYXQ2NAZzdHJpbmcGaW50OFtdB2ludDE2W10HaW50MzJbXQdpbnQ2NFtdBWJ5dGVzCHVpbnQxNltdCHVpbnQzMltdCHVpbnQ2NFtdCWZsb2F0MzJbXQlmbG9hdDY0W10Ic3RyaW5nW10A"
)
export const abi = ABI.from(abiBlob)
export class Contract extends BaseContract {
  constructor(args:PartialBy<ContractArgs, "abi" | "account">) {
    super({
      client: args.client,
      abi,
      account: args.account || Name.from("boid")
    })
  }

  action<T extends ActionNames>(
    name:T,
    data:ActionNameParams[T],
    options?:ActionOptions
  ):Action {
    return super.action(name, data, options)
  }

  table<T extends TableNames>(name:T, scope?:NameType):Table<RowType<T>> {
    return super.table(name, scope, TableMap[name])
  }
}
export interface ActionNameParams {
    "account.add":ActionParams.accountadd
    "account.buy":ActionParams.accountbuy
    "account.edit":ActionParams.accountedit
    "account.free":ActionParams.accountfree
    "account.rm":ActionParams.accountrm
    auth:ActionParams.auth
    "auth.addkey":ActionParams.authaddkey
    "auth.init":ActionParams.authinit
    "auth.rmkey":ActionParams.authrmkey
    "booster.add":ActionParams.boosteradd
    "booster.new":ActionParams.boosternew
    "booster.rm":ActionParams.boosterrm
    "config.clear":ActionParams.configclear
    "config.set":ActionParams.configset
    "global.chain":ActionParams.globalchain
    "global.clear":ActionParams.globalclear
    "global.set":ActionParams.globalset
    internalxfer:ActionParams.internalxfer
    "invite.add":ActionParams.inviteadd
    "invite.buy":ActionParams.invitebuy
    "invite.claim":ActionParams.inviteclaim
    "invite.rm":ActionParams.inviterm
    logpwradd:ActionParams.logpwradd
    logpwrclaim:ActionParams.logpwrclaim
    mint:ActionParams.mint
    "nft.lock":ActionParams.nftlock
    "nft.receiver":ActionParams.nftreceiver
    "nft.withdraw":ActionParams.nftwithdraw
    "nft.xfer":ActionParams.nftxfer
    "offer.add":ActionParams.offeradd
    "offer.claim":ActionParams.offerclaim
    "offer.clean":ActionParams.offerclean
    "offer.rm":ActionParams.offerrm
    "owner.add":ActionParams.owneradd
    "owner.rm":ActionParams.ownerrm
    "power.add":ActionParams.poweradd
    "power.claim":ActionParams.powerclaim
    "sponsor.rm":ActionParams.sponsorrm
    "sponsor.set":ActionParams.sponsorset
    stake:ActionParams.stake
    "stake.deleg":ActionParams.stakedeleg
    "team.change":ActionParams.teamchange
    "team.create":ActionParams.teamcreate
    "team.edit":ActionParams.teamedit
    "team.rm":ActionParams.teamrm
    "team.taxrate":ActionParams.teamtaxrate
    thisround:ActionParams.thisround
    "unstake.end":ActionParams.unstakeend
    "unstake.init":ActionParams.unstakeinit
    "unstake.stop":ActionParams.unstakestop
    "unstke.deleg":ActionParams.unstkedeleg
    withdraw:ActionParams.withdraw
}
export namespace ActionParams {
    export namespace Type {
        export interface AccountCreate {
            boid_id:NameType
            keys:PublicKeyType[]
            owners:NameType[]
        }
        export interface Action {
            account:NameType
            name:NameType
            authorization:Type.PermissionLevel[]
            data:BytesType
        }
        export interface PermissionLevel {
            actor:NameType
            permission:NameType
        }
        export interface Booster {
            booster_id:UInt8Type
            pwr_multiplier:UInt8Type
            pwr_add_per_round:UInt16Type
            expire_after_elapsed_rounds:UInt16Type
            aggregate_pwr_capacity:UInt32Type
        }
        export interface Config {
            account:Type.ConfigAccount
            power:Type.ConfigPower
            mint:Type.ConfigMint
            team:Type.ConfigTeam
            stake:Type.ConfigStake
            time:Type.ConfigTime
            auth:Type.ConfigAuth
            nft:Type.ConfigNft
            paused:boolean
            allow_deposits:boolean
            allow_withdrawals:boolean
            recoveryAccount:NameType
        }
        export interface ConfigAccount {
            invite_price:UInt32Type
            premium_purchase_price:UInt32Type
            max_premium_prefix:UInt8Type
            max_owners:UInt8Type
            max_boosters:UInt8Type
            suffix_whitelist:NameType[]
            remove_sponsor_price:UInt32Type
            sponsor_max_invite_codes:UInt8Type
            invite_code_expire_rounds:UInt16Type
        }
        export interface ConfigPower {
            sponsor_tax_mult:Float32Type
            powered_stake_mult:Float32Type
            claim_maximum_elapsed_rounds:UInt16Type
            soft_max_pwr_add:UInt16Type
            history_slots_length:UInt8Type
        }
        export interface ConfigMint {
            round_powered_stake_mult:Float32Type
            round_power_mult:Float32Type
        }
        export interface ConfigTeam {
            change_min_rounds:UInt16Type
            edit_team_min_rounds:UInt16Type
            team_edit_max_pct_change:UInt16Type
            buy_team_cost:UInt32Type
            owner_stake_required:UInt32Type
            owner_future_stake_lock_rounds_required:UInt16Type
        }
        export interface ConfigStake {
            unstake_rounds:UInt8Type
            extra_stake_min_locked_rounds:UInt8Type
        }
        export interface ConfigTime {
            rounds_start_sec_since_epoch:UInt32Type
            round_length_sec:UInt32Type
        }
        export interface ConfigAuth {
            key_actions_whitelist:NameType[]
            key_account_max_stake:UInt32Type
            key_account_max_balance:UInt32Type
            account_max_keys:UInt8Type
            worker_max_bill_per_action:UInt32Type
        }
        export interface ConfigNft {
            boid_id_maximum_nfts:UInt16Type
            whitelist_collections:NameType[]
        }
        export interface Global {
            chain_name:NameType
            total_power:UInt64Type
            last_inflation_adjust_round:UInt16Type
        }
        export interface PowerClaimLog {
            before:UInt32Type
            after:UInt32Type
            from_boosters:UInt32Type
            elapsed_rounds:UInt16Type
        }
        export interface MintLog {
            power_mint:UInt32Type
            powered_stake_mint:UInt32Type
            account_earned:UInt32Type
            team_cut:UInt32Type
            team_owner_earned:UInt32Type
            overstake_mint:UInt32Type
            total:UInt32Type
        }
        export interface OfferRequirements {
            team_id:BytesType
            min_power:UInt16Type
            min_balance:UInt32Type
            min_stake:UInt32Type
            min_cumulative_team_contribution:UInt32Type
        }
        export interface OfferAction {
            delegated_stake:UInt16Type
            stake_locked_additional_rounds:UInt16Type
            nft_actions:Type.NftAction[]
            balance_payment:UInt32Type
        }
        export interface NftAction {
            collection_name:NameType
            schema_name:NameType
            template_id:Int32Type
            match_immutable_attributes:Type.AtomicAttribute[]
            match_mutable_attributes:Type.AtomicAttribute[]
            burn:boolean
            lock_rounds:UInt16Type
        }
        export interface AtomicAttribute {
            key:string
            value:Type.AtomicValue
        }
        export type AtomicValue =
            | Int8Type
            | Int16Type
            | Int32Type
            | Int64Type
            | UInt8Type
            | UInt16Type
            | UInt32Type
            | UInt64Type
            | Float32Type
            | Float64Type
            | string
            | Int8Type[]
            | Int16Type[]
            | Int32Type[]
            | Int64Type[]
            | BytesType
            | UInt16Type[]
            | UInt32Type[]
            | UInt64Type[]
            | Float32Type[]
            | Float64Type[]
            | string[]
            | Types.AtomicValue
        export interface OfferRewards {
            nft_mints:Type.NftMint[]
            balance_deposit:UInt32Type
            delegated_stake:UInt16Type
            stake_locked_additional_rounds:UInt16Type
            activate_booster_ids:BytesType
        }
        export interface NftMint {
            mint_template_id:Int32Type
            mint_schema_name:NameType
            mint_collection_name:NameType
            immutable_data:Type.AtomicAttribute[]
            mutable_data:Type.AtomicAttribute[]
            quantity:UInt8Type
        }
        export interface OfferLimits {
            offer_quantity_remaining:UInt32Type
            available_until_round:UInt16Type
        }
        export interface Sponsor {
            sponsor_boid_id:NameType
            invites_balance:UInt16Type
            invite_codes_unclaimed:UInt16Type
            invite_codes_claimed:UInt32Type
            sponsored_upgrades:UInt32Type
            upgrades_total_earned:UInt32Type
        }
    }
    export interface accountadd {
        boid_id:NameType
        owners:NameType[]
        sponsors:NameType[]
        keys:PublicKeyType[]
    }
    export interface accountbuy {
        payer_boid_id:NameType
        new_account:Type.AccountCreate
    }
    export interface accountedit {
        boid_id:NameType
        meta:BytesType
    }
    export interface accountfree {
        boid_id:NameType
    }
    export interface accountrm {
        boid_id:NameType
    }
    export interface auth {
        boid_id:NameType
        actions:Type.Action[]
        sig:SignatureType
        keyIndex:Int32Type
        expires_utc_sec:UInt32Type
    }
    export interface authaddkey {
        boid_id:NameType
        key:PublicKeyType
    }
    export interface authinit {}
    export interface authrmkey {
        boid_id:NameType
        keyIndex:Int32Type
    }
    export interface boosteradd {
        boid_id:NameType
        booster_id:UInt8Type
    }
    export interface boosternew {
        booster:Type.Booster
    }
    export interface boosterrm {
        boid_id:NameType
        booster_index:Int32Type[]
    }
    export interface configclear {}
    export interface configset {
        config:Type.Config
    }
    export interface globalchain {
        chain_name:NameType
    }
    export interface globalclear {}
    export interface globalset {
        globalData:Type.Global
    }
    export interface internalxfer {
        from_boid_id:NameType
        to_boid_id:NameType
        quantity:UInt32Type
        memo:string
    }
    export interface inviteadd {
        boid_id:NameType
        invite_code:UInt64Type
        key:PublicKeyType
    }
    export interface invitebuy {
        boid_id:NameType
        quantity:UInt16Type
    }
    export interface inviteclaim {
        sponsor_boid_id:NameType
        invite_code:UInt64Type
        sig:SignatureType
        new_account:Type.AccountCreate
    }
    export interface inviterm {
        sponsor_boid_id:NameType
        invite_code:UInt64Type
    }
    export interface logpwradd {
        boid_id:NameType
        received:UInt16Type
        from_mult_mods:UInt16Type
        diverted_to_sponsor:UInt16Type
        power_increased:UInt16Type
        orign:NameType
    }
    export interface logpwrclaim {
        boid_id:NameType
        power:Type.PowerClaimLog
        mint:Type.MintLog
    }
    export interface mint {
        to:NameType
        whole_quantity:UInt32Type
    }
    export interface nftlock {
        boid_id:NameType
        asset_id:UInt64Type
        locked_until_round:UInt16Type
    }
    export interface nftreceiver {
        boid_id:NameType
        mint_quantity:UInt16Type
    }
    export interface nftwithdraw {
        boid_id:NameType
        asset_ids:UInt64Type[]
        to:NameType
    }
    export interface nftxfer {
        from_boid_id:NameType
        to_boid_id:NameType
        asset_ids:UInt64Type[]
    }
    export interface offeradd {
        requirements:Type.OfferRequirements
        actions:Type.OfferAction
        rewards:Type.OfferRewards
        limits:Type.OfferLimits
    }
    export interface offerclaim {
        boid_id:NameType
        offer_id:UInt64Type
        required_nft_action_ids:UInt64Type[]
    }
    export interface offerclean {}
    export interface offerrm {
        offer_id:UInt64Type
    }
    export interface owneradd {
        boid_id:NameType
        owner:NameType
    }
    export interface ownerrm {
        boid_id:NameType
        owner:NameType
    }
    export interface poweradd {
        boid_id:NameType
        power:UInt16Type
    }
    export interface powerclaim {
        boid_id:NameType
    }
    export interface sponsorrm {
        sponsor_boid_id:NameType
    }
    export interface sponsorset {
        row:Type.Sponsor
    }
    export interface stake {
        boid_id:NameType
        quantity:UInt32Type
    }
    export interface stakedeleg {
        from_boid_id:NameType
        to_boid_id:NameType
        stake_quantity:UInt16Type
        lock_until_round:UInt16Type
    }
    export interface teamchange {
        boid_id:NameType
        new_team_id:UInt8Type
        new_pwr_tax_mult:UInt8Type
    }
    export interface teamcreate {
        owner:NameType
        min_pwr_tax_mult:UInt8Type
        owner_cut_mult:UInt8Type
        url_safe_name:string
    }
    export interface teamedit {
        team_id:UInt8Type
        owner:NameType
        managers:NameType[]
        min_pwr_tax_mult:UInt8Type
        owner_cut_mult:UInt8Type
        url_safe_name:string
        meta:BytesType
    }
    export interface teamrm {
        team_id:UInt8Type
    }
    export interface teamtaxrate {
        boid_id:NameType
        new_pwr_tax_mult:UInt8Type
    }
    export interface thisround {}
    export interface unstakeend {
        boid_id:NameType
    }
    export interface unstakeinit {
        boid_id:NameType
        quantity:UInt32Type
    }
    export interface unstakestop {
        boid_id:NameType
    }
    export interface unstkedeleg {
        stake_id:UInt64Type
    }
    export interface withdraw {
        boid_id:NameType
        quantity:UInt32Type
        to:NameType
    }
}
export namespace Types {
    @Variant.type("AtomicValue", [
      Int8,
      Int16,
      Int32,
      Int64,
      UInt8,
      UInt16,
      UInt32,
      UInt64,
      Float32,
      Float64,
      "string",
      { type: Int8, array: true },
      { type: Int16, array: true },
      { type: Int32, array: true },
      { type: Int64, array: true },
      Bytes,
      { type: UInt16, array: true },
      { type: UInt32, array: true },
      { type: UInt64, array: true },
      { type: Float32, array: true },
      { type: Float64, array: true },
      "string[]"
    ])
    export class AtomicValue extends Variant {
      declare value:| Int8
            | Int16
            | Int32
            | Int64
            | UInt8
            | UInt16
            | UInt32
            | UInt64
            | Float32
            | Float64
            | string
            | Int8[]
            | Int16[]
            | Int32[]
            | Int64[]
            | Bytes
            | UInt16[]
            | UInt32[]
            | UInt64[]
            | Float32[]
            | Float64[]
            | string[]
    }
    @Struct.type("AccountAuth")
    export class AccountAuth extends Struct {
        @Struct.field(PublicKey, { array: true })
          keys!:PublicKey[]

        @Struct.field(UInt8)
          nonce!:UInt8
    }
    @Struct.type("TokenUnstake")
    export class TokenUnstake extends Struct {
        @Struct.field(UInt16)
          redeemable_after_round!:UInt16

        @Struct.field(UInt32)
          quantity!:UInt32
    }
    @Struct.type("AccountStake")
    export class AccountStake extends Struct {
        @Struct.field(TokenUnstake, { array: true })
          unstaking!:TokenUnstake[]

        @Struct.field(UInt32)
          self_staked!:UInt32

        @Struct.field(UInt16)
          received_delegated_stake!:UInt16
    }
    @Struct.type("AccountBooster")
    export class AccountBooster extends Struct {
        @Struct.field(UInt8)
          pwr_multiplier!:UInt8

        @Struct.field(UInt16)
          pwr_add_per_round!:UInt16

        @Struct.field(UInt16)
          expires_round!:UInt16

        @Struct.field(UInt32)
          aggregate_pwr_remaining!:UInt32
    }
    @Struct.type("AccountPower")
    export class AccountPower extends Struct {
        @Struct.field(UInt16)
          last_claimed_round!:UInt16

        @Struct.field(UInt16)
          last_added_round!:UInt16

        @Struct.field(UInt16)
          rating!:UInt16

        @Struct.field(UInt16, { array: true })
          history!:UInt16[]

        @Struct.field(AccountBooster, { array: true })
          mods!:AccountBooster[]
    }
    @Struct.type("AccountTeam")
    export class AccountTeam extends Struct {
        @Struct.field(UInt8)
          team_id!:UInt8

        @Struct.field(UInt16)
          last_edit_round!:UInt16

        @Struct.field(UInt8)
          team_tax_mult!:UInt8

        @Struct.field(UInt32)
          team_cumulative_contribution!:UInt32
    }
    @Struct.type("Account")
    export class Account extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Name, { array: true })
          owners!:Name[]

        @Struct.field(AccountAuth)
          auth!:AccountAuth

        @Struct.field(Name, { array: true })
          sponsors!:Name[]

        @Struct.field(AccountStake)
          stake!:AccountStake

        @Struct.field(AccountPower)
          power!:AccountPower

        @Struct.field(AccountTeam)
          team!:AccountTeam

        @Struct.field(UInt32)
          balance!:UInt32

        @Struct.field(UInt16)
          nft_balance!:UInt16

        @Struct.field("bool")
          recoverable!:boolean
    }
    @Struct.type("AccountCreate")
    export class AccountCreate extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(PublicKey, { array: true })
          keys!:PublicKey[]

        @Struct.field(Name, { array: true })
          owners!:Name[]
    }
    @Struct.type("AcctMeta")
    export class AcctMeta extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Bytes)
          meta!:Bytes
    }
    @Struct.type("PermissionLevel")
    export class PermissionLevel extends Struct {
        @Struct.field(Name)
          actor!:Name

        @Struct.field(Name)
          permission!:Name
    }
    @Struct.type("Action")
    export class Action extends Struct {
        @Struct.field(Name)
          account!:Name

        @Struct.field(Name)
          name!:Name

        @Struct.field(PermissionLevel, { array: true })
          authorization!:PermissionLevel[]

        @Struct.field(Bytes)
          data!:Bytes
    }
    @Struct.type("AtomicAttribute")
    export class AtomicAttribute extends Struct {
        @Struct.field("string")
          key!:string

        @Struct.field(AtomicValue)
          value!:AtomicValue
    }
    @Struct.type("AtomicFormat")
    export class AtomicFormat extends Struct {
        @Struct.field("string")
          name!:string

        @Struct.field("string")
          type!:string
    }
    @Struct.type("Auth")
    export class Auth extends Struct {
        @Struct.field(Name)
          boid_id_auth!:Name
    }
    @Struct.type("Booster")
    export class Booster extends Struct {
        @Struct.field(UInt8)
          booster_id!:UInt8

        @Struct.field(UInt8)
          pwr_multiplier!:UInt8

        @Struct.field(UInt16)
          pwr_add_per_round!:UInt16

        @Struct.field(UInt16)
          expire_after_elapsed_rounds!:UInt16

        @Struct.field(UInt32)
          aggregate_pwr_capacity!:UInt32
    }
    @Struct.type("ConfigAccount")
    export class ConfigAccount extends Struct {
        @Struct.field(UInt32)
          invite_price!:UInt32

        @Struct.field(UInt32)
          premium_purchase_price!:UInt32

        @Struct.field(UInt8)
          max_premium_prefix!:UInt8

        @Struct.field(UInt8)
          max_owners!:UInt8

        @Struct.field(UInt8)
          max_boosters!:UInt8

        @Struct.field(Name, { array: true })
          suffix_whitelist!:Name[]

        @Struct.field(UInt32)
          remove_sponsor_price!:UInt32

        @Struct.field(UInt8)
          sponsor_max_invite_codes!:UInt8

        @Struct.field(UInt16)
          invite_code_expire_rounds!:UInt16
    }
    @Struct.type("ConfigPower")
    export class ConfigPower extends Struct {
        @Struct.field(Float32)
          sponsor_tax_mult!:Float32

        @Struct.field(Float32)
          powered_stake_mult!:Float32

        @Struct.field(UInt16)
          claim_maximum_elapsed_rounds!:UInt16

        @Struct.field(UInt16)
          soft_max_pwr_add!:UInt16

        @Struct.field(UInt8)
          history_slots_length!:UInt8
    }
    @Struct.type("ConfigMint")
    export class ConfigMint extends Struct {
        @Struct.field(Float32)
          round_powered_stake_mult!:Float32

        @Struct.field(Float32)
          round_power_mult!:Float32
    }
    @Struct.type("ConfigTeam")
    export class ConfigTeam extends Struct {
        @Struct.field(UInt16)
          change_min_rounds!:UInt16

        @Struct.field(UInt16)
          edit_team_min_rounds!:UInt16

        @Struct.field(UInt16)
          team_edit_max_pct_change!:UInt16

        @Struct.field(UInt32)
          buy_team_cost!:UInt32

        @Struct.field(UInt32)
          owner_stake_required!:UInt32

        @Struct.field(UInt16)
          owner_future_stake_lock_rounds_required!:UInt16
    }
    @Struct.type("ConfigStake")
    export class ConfigStake extends Struct {
        @Struct.field(UInt8)
          unstake_rounds!:UInt8

        @Struct.field(UInt8)
          extra_stake_min_locked_rounds!:UInt8
    }
    @Struct.type("ConfigTime")
    export class ConfigTime extends Struct {
        @Struct.field(UInt32)
          rounds_start_sec_since_epoch!:UInt32

        @Struct.field(UInt32)
          round_length_sec!:UInt32
    }
    @Struct.type("ConfigAuth")
    export class ConfigAuth extends Struct {
        @Struct.field(Name, { array: true })
          key_actions_whitelist!:Name[]

        @Struct.field(UInt32)
          key_account_max_stake!:UInt32

        @Struct.field(UInt32)
          key_account_max_balance!:UInt32

        @Struct.field(UInt8)
          account_max_keys!:UInt8

        @Struct.field(UInt32)
          worker_max_bill_per_action!:UInt32
    }
    @Struct.type("ConfigNft")
    export class ConfigNft extends Struct {
        @Struct.field(UInt16)
          boid_id_maximum_nfts!:UInt16

        @Struct.field(Name, { array: true })
          whitelist_collections!:Name[]
    }
    @Struct.type("Config")
    export class Config extends Struct {
        @Struct.field(ConfigAccount)
          account!:ConfigAccount

        @Struct.field(ConfigPower)
          power!:ConfigPower

        @Struct.field(ConfigMint)
          mint!:ConfigMint

        @Struct.field(ConfigTeam)
          team!:ConfigTeam

        @Struct.field(ConfigStake)
          stake!:ConfigStake

        @Struct.field(ConfigTime)
          time!:ConfigTime

        @Struct.field(ConfigAuth)
          auth!:ConfigAuth

        @Struct.field(ConfigNft)
          nft!:ConfigNft

        @Struct.field("bool")
          paused!:boolean

        @Struct.field("bool")
          allow_deposits!:boolean

        @Struct.field("bool")
          allow_withdrawals!:boolean

        @Struct.field(Name)
          recoveryAccount!:Name
    }
    @Struct.type("ExtendedSymbol")
    export class ExtendedSymbol extends Struct {
        @Struct.field(Asset.Symbol)
          sym!:Asset.Symbol

        @Struct.field(Name)
          contract!:Name
    }
    @Struct.type("Global")
    export class Global extends Struct {
        @Struct.field(Name)
          chain_name!:Name

        @Struct.field(UInt64)
          total_power!:UInt64

        @Struct.field(UInt16)
          last_inflation_adjust_round!:UInt16
    }
    @Struct.type("Invite")
    export class Invite extends Struct {
        @Struct.field(UInt64)
          invite_code!:UInt64

        @Struct.field(PublicKey)
          key!:PublicKey

        @Struct.field(UInt16)
          created_round!:UInt16
    }
    @Struct.type("MintLog")
    export class MintLog extends Struct {
        @Struct.field(UInt32)
          power_mint!:UInt32

        @Struct.field(UInt32)
          powered_stake_mint!:UInt32

        @Struct.field(UInt32)
          account_earned!:UInt32

        @Struct.field(UInt32)
          team_cut!:UInt32

        @Struct.field(UInt32)
          team_owner_earned!:UInt32

        @Struct.field(UInt32)
          overstake_mint!:UInt32

        @Struct.field(UInt32)
          total!:UInt32
    }
    @Struct.type("NFT")
    export class NFT extends Struct {
        @Struct.field(UInt64)
          asset_id!:UInt64

        @Struct.field(UInt16)
          locked_until_round!:UInt16
    }
    @Struct.type("NFTMint")
    export class NFTMint extends Struct {
        @Struct.field(Name)
          mint_receiver_boid_id!:Name

        @Struct.field(UInt16)
          mint_quantity_remaining!:UInt16
    }
    @Struct.type("NftAction")
    export class NftAction extends Struct {
        @Struct.field(Name)
          collection_name!:Name

        @Struct.field(Name)
          schema_name!:Name

        @Struct.field(Int32)
          template_id!:Int32

        @Struct.field(AtomicAttribute, { array: true })
          match_immutable_attributes!:AtomicAttribute[]

        @Struct.field(AtomicAttribute, { array: true })
          match_mutable_attributes!:AtomicAttribute[]

        @Struct.field("bool")
          burn!:boolean

        @Struct.field(UInt16)
          lock_rounds!:UInt16
    }
    @Struct.type("NftMint")
    export class NftMint extends Struct {
        @Struct.field(Int32)
          mint_template_id!:Int32

        @Struct.field(Name)
          mint_schema_name!:Name

        @Struct.field(Name)
          mint_collection_name!:Name

        @Struct.field(AtomicAttribute, { array: true })
          immutable_data!:AtomicAttribute[]

        @Struct.field(AtomicAttribute, { array: true })
          mutable_data!:AtomicAttribute[]

        @Struct.field(UInt8)
          quantity!:UInt8
    }
    @Struct.type("OfferRequirements")
    export class OfferRequirements extends Struct {
        @Struct.field(Bytes)
          team_id!:Bytes

        @Struct.field(UInt16)
          min_power!:UInt16

        @Struct.field(UInt32)
          min_balance!:UInt32

        @Struct.field(UInt32)
          min_stake!:UInt32

        @Struct.field(UInt32)
          min_cumulative_team_contribution!:UInt32
    }
    @Struct.type("OfferAction")
    export class OfferAction extends Struct {
        @Struct.field(UInt16)
          delegated_stake!:UInt16

        @Struct.field(UInt16)
          stake_locked_additional_rounds!:UInt16

        @Struct.field(NftAction, { array: true })
          nft_actions!:NftAction[]

        @Struct.field(UInt32)
          balance_payment!:UInt32
    }
    @Struct.type("OfferRewards")
    export class OfferRewards extends Struct {
        @Struct.field(NftMint, { array: true })
          nft_mints!:NftMint[]

        @Struct.field(UInt32)
          balance_deposit!:UInt32

        @Struct.field(UInt16)
          delegated_stake!:UInt16

        @Struct.field(UInt16)
          stake_locked_additional_rounds!:UInt16

        @Struct.field(Bytes)
          activate_booster_ids!:Bytes
    }
    @Struct.type("OfferLimits")
    export class OfferLimits extends Struct {
        @Struct.field(UInt32)
          offer_quantity_remaining!:UInt32

        @Struct.field(UInt16)
          available_until_round!:UInt16
    }
    @Struct.type("Offer")
    export class Offer extends Struct {
        @Struct.field(UInt64)
          offer_id!:UInt64

        @Struct.field(OfferRequirements)
          requirements!:OfferRequirements

        @Struct.field(OfferAction)
          actions!:OfferAction

        @Struct.field(OfferRewards)
          rewards!:OfferRewards

        @Struct.field(OfferLimits)
          limits!:OfferLimits

        @Struct.field(UInt32)
          total_claimed!:UInt32
    }
    @Struct.type("PowerClaimLog")
    export class PowerClaimLog extends Struct {
        @Struct.field(UInt32)
          before!:UInt32

        @Struct.field(UInt32)
          after!:UInt32

        @Struct.field(UInt32)
          from_boosters!:UInt32

        @Struct.field(UInt16)
          elapsed_rounds!:UInt16
    }
    @Struct.type("Sponsor")
    export class Sponsor extends Struct {
        @Struct.field(Name)
          sponsor_boid_id!:Name

        @Struct.field(UInt16)
          invites_balance!:UInt16

        @Struct.field(UInt16)
          invite_codes_unclaimed!:UInt16

        @Struct.field(UInt32)
          invite_codes_claimed!:UInt32

        @Struct.field(UInt32)
          sponsored_upgrades!:UInt32

        @Struct.field(UInt32)
          upgrades_total_earned!:UInt32
    }
    @Struct.type("Stake")
    export class Stake extends Struct {
        @Struct.field(UInt64)
          stake_id!:UInt64

        @Struct.field(Name)
          from_boid_id!:Name

        @Struct.field(Name)
          to_boid_id!:Name

        @Struct.field(UInt16)
          stake_quantity!:UInt16

        @Struct.field(UInt16)
          locked_until_round!:UInt16
    }
    @Struct.type("Team")
    export class Team extends Struct {
        @Struct.field(UInt16)
          team_id!:UInt16

        @Struct.field(UInt32)
          balance!:UInt32

        @Struct.field(AccountStake)
          stake!:AccountStake

        @Struct.field(Name)
          owner!:Name

        @Struct.field(Name, { array: true })
          managers!:Name[]

        @Struct.field(UInt8)
          min_pwr_tax_mult!:UInt8

        @Struct.field(UInt8)
          owner_cut_mult!:UInt8

        @Struct.field("string")
          url_safe_name!:string

        @Struct.field(UInt64)
          power!:UInt64

        @Struct.field(UInt32)
          members!:UInt32

        @Struct.field(UInt16)
          last_edit_round!:UInt16

        @Struct.field(Bytes)
          meta!:Bytes
    }
    @Struct.type("account.add")
    export class accountadd extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Name, { array: true })
          owners!:Name[]

        @Struct.field(Name, { array: true })
          sponsors!:Name[]

        @Struct.field(PublicKey, { array: true })
          keys!:PublicKey[]
    }
    @Struct.type("account.buy")
    export class accountbuy extends Struct {
        @Struct.field(Name)
          payer_boid_id!:Name

        @Struct.field(AccountCreate)
          new_account!:AccountCreate
    }
    @Struct.type("account.edit")
    export class accountedit extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Bytes)
          meta!:Bytes
    }
    @Struct.type("account.free")
    export class accountfree extends Struct {
        @Struct.field(Name)
          boid_id!:Name
    }
    @Struct.type("account.rm")
    export class accountrm extends Struct {
        @Struct.field(Name)
          boid_id!:Name
    }
    @Struct.type("auth")
    export class auth extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Action, { array: true })
          actions!:Action[]

        @Struct.field(Signature)
          sig!:Signature

        @Struct.field(Int32)
          keyIndex!:Int32

        @Struct.field(UInt32)
          expires_utc_sec!:UInt32
    }
    @Struct.type("auth.addkey")
    export class authaddkey extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(PublicKey)
          key!:PublicKey
    }
    @Struct.type("auth.init")
    export class authinit extends Struct {}
    @Struct.type("auth.rmkey")
    export class authrmkey extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Int32)
          keyIndex!:Int32
    }
    @Struct.type("booster.add")
    export class boosteradd extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt8)
          booster_id!:UInt8
    }
    @Struct.type("booster.new")
    export class boosternew extends Struct {
        @Struct.field(Booster)
          booster!:Booster
    }
    @Struct.type("booster.rm")
    export class boosterrm extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Int32, { array: true })
          booster_index!:Int32[]
    }
    @Struct.type("config.clear")
    export class configclear extends Struct {}
    @Struct.type("config.set")
    export class configset extends Struct {
        @Struct.field(Config)
          config!:Config
    }
    @Struct.type("global.chain")
    export class globalchain extends Struct {
        @Struct.field(Name)
          chain_name!:Name
    }
    @Struct.type("global.clear")
    export class globalclear extends Struct {}
    @Struct.type("global.set")
    export class globalset extends Struct {
        @Struct.field(Global)
          globalData!:Global
    }
    @Struct.type("internalxfer")
    export class internalxfer extends Struct {
        @Struct.field(Name)
          from_boid_id!:Name

        @Struct.field(Name)
          to_boid_id!:Name

        @Struct.field(UInt32)
          quantity!:UInt32

        @Struct.field("string")
          memo!:string
    }
    @Struct.type("invite.add")
    export class inviteadd extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt64)
          invite_code!:UInt64

        @Struct.field(PublicKey)
          key!:PublicKey
    }
    @Struct.type("invite.buy")
    export class invitebuy extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt16)
          quantity!:UInt16
    }
    @Struct.type("invite.claim")
    export class inviteclaim extends Struct {
        @Struct.field(Name)
          sponsor_boid_id!:Name

        @Struct.field(UInt64)
          invite_code!:UInt64

        @Struct.field(Signature)
          sig!:Signature

        @Struct.field(AccountCreate)
          new_account!:AccountCreate
    }
    @Struct.type("invite.rm")
    export class inviterm extends Struct {
        @Struct.field(Name)
          sponsor_boid_id!:Name

        @Struct.field(UInt64)
          invite_code!:UInt64
    }
    @Struct.type("logpwradd")
    export class logpwradd extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt16)
          received!:UInt16

        @Struct.field(UInt16)
          from_mult_mods!:UInt16

        @Struct.field(UInt16)
          diverted_to_sponsor!:UInt16

        @Struct.field(UInt16)
          power_increased!:UInt16

        @Struct.field(Name)
          orign!:Name
    }
    @Struct.type("logpwrclaim")
    export class logpwrclaim extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(PowerClaimLog)
          power!:PowerClaimLog

        @Struct.field(MintLog)
          mint!:MintLog
    }
    @Struct.type("mint")
    export class mint extends Struct {
        @Struct.field(Name)
          to!:Name

        @Struct.field(UInt32)
          whole_quantity!:UInt32
    }
    @Struct.type("nft.lock")
    export class nftlock extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt64)
          asset_id!:UInt64

        @Struct.field(UInt16)
          locked_until_round!:UInt16
    }
    @Struct.type("nft.receiver")
    export class nftreceiver extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt16)
          mint_quantity!:UInt16
    }
    @Struct.type("nft.withdraw")
    export class nftwithdraw extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt64, { array: true })
          asset_ids!:UInt64[]

        @Struct.field(Name)
          to!:Name
    }
    @Struct.type("nft.xfer")
    export class nftxfer extends Struct {
        @Struct.field(Name)
          from_boid_id!:Name

        @Struct.field(Name)
          to_boid_id!:Name

        @Struct.field(UInt64, { array: true })
          asset_ids!:UInt64[]
    }
    @Struct.type("offer.add")
    export class offeradd extends Struct {
        @Struct.field(OfferRequirements)
          requirements!:OfferRequirements

        @Struct.field(OfferAction)
          actions!:OfferAction

        @Struct.field(OfferRewards)
          rewards!:OfferRewards

        @Struct.field(OfferLimits)
          limits!:OfferLimits
    }
    @Struct.type("offer.claim")
    export class offerclaim extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt64)
          offer_id!:UInt64

        @Struct.field(UInt64, { array: true })
          required_nft_action_ids!:UInt64[]
    }
    @Struct.type("offer.clean")
    export class offerclean extends Struct {}
    @Struct.type("offer.rm")
    export class offerrm extends Struct {
        @Struct.field(UInt64)
          offer_id!:UInt64
    }
    @Struct.type("owner.add")
    export class owneradd extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Name)
          owner!:Name
    }
    @Struct.type("owner.rm")
    export class ownerrm extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(Name)
          owner!:Name
    }
    @Struct.type("power.add")
    export class poweradd extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt16)
          power!:UInt16
    }
    @Struct.type("power.claim")
    export class powerclaim extends Struct {
        @Struct.field(Name)
          boid_id!:Name
    }
    @Struct.type("sponsor.rm")
    export class sponsorrm extends Struct {
        @Struct.field(Name)
          sponsor_boid_id!:Name
    }
    @Struct.type("sponsor.set")
    export class sponsorset extends Struct {
        @Struct.field(Sponsor)
          row!:Sponsor
    }
    @Struct.type("stake")
    export class stake extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt32)
          quantity!:UInt32
    }
    @Struct.type("stake.deleg")
    export class stakedeleg extends Struct {
        @Struct.field(Name)
          from_boid_id!:Name

        @Struct.field(Name)
          to_boid_id!:Name

        @Struct.field(UInt16)
          stake_quantity!:UInt16

        @Struct.field(UInt16)
          lock_until_round!:UInt16
    }
    @Struct.type("team.change")
    export class teamchange extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt8)
          new_team_id!:UInt8

        @Struct.field(UInt8)
          new_pwr_tax_mult!:UInt8
    }
    @Struct.type("team.create")
    export class teamcreate extends Struct {
        @Struct.field(Name)
          owner!:Name

        @Struct.field(UInt8)
          min_pwr_tax_mult!:UInt8

        @Struct.field(UInt8)
          owner_cut_mult!:UInt8

        @Struct.field("string")
          url_safe_name!:string
    }
    @Struct.type("team.edit")
    export class teamedit extends Struct {
        @Struct.field(UInt8)
          team_id!:UInt8

        @Struct.field(Name)
          owner!:Name

        @Struct.field(Name, { array: true })
          managers!:Name[]

        @Struct.field(UInt8)
          min_pwr_tax_mult!:UInt8

        @Struct.field(UInt8)
          owner_cut_mult!:UInt8

        @Struct.field("string")
          url_safe_name!:string

        @Struct.field(Bytes)
          meta!:Bytes
    }
    @Struct.type("team.rm")
    export class teamrm extends Struct {
        @Struct.field(UInt8)
          team_id!:UInt8
    }
    @Struct.type("team.taxrate")
    export class teamtaxrate extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt8)
          new_pwr_tax_mult!:UInt8
    }
    @Struct.type("thisround")
    export class thisround extends Struct {}
    @Struct.type("unstake.end")
    export class unstakeend extends Struct {
        @Struct.field(Name)
          boid_id!:Name
    }
    @Struct.type("unstake.init")
    export class unstakeinit extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt32)
          quantity!:UInt32
    }
    @Struct.type("unstake.stop")
    export class unstakestop extends Struct {
        @Struct.field(Name)
          boid_id!:Name
    }
    @Struct.type("unstke.deleg")
    export class unstkedeleg extends Struct {
        @Struct.field(UInt64)
          stake_id!:UInt64
    }
    @Struct.type("withdraw")
    export class withdraw extends Struct {
        @Struct.field(Name)
          boid_id!:Name

        @Struct.field(UInt32)
          quantity!:UInt32

        @Struct.field(Name)
          to!:Name
    }
}
export const TableMap = {
  accounts: Types.Account,
  acctmeta: Types.AcctMeta,
  auth: Types.Auth,
  boosters: Types.Booster,
  config: Types.Config,
  global: Types.Global,
  invites: Types.Invite,
  nftmint: Types.NFTMint,
  nfts: Types.NFT,
  offers: Types.Offer,
  sponsors: Types.Sponsor,
  stakes: Types.Stake,
  teams: Types.Team
}
export interface TableTypes {
    accounts:Types.Account
    acctmeta:Types.AcctMeta
    auth:Types.Auth
    boosters:Types.Booster
    config:Types.Config
    global:Types.Global
    invites:Types.Invite
    nftmint:Types.NFTMint
    nfts:Types.NFT
    offers:Types.Offer
    sponsors:Types.Sponsor
    stakes:Types.Stake
    teams:Types.Team
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type ActionNames = keyof ActionNameParams
export type TableNames = keyof TableTypes
