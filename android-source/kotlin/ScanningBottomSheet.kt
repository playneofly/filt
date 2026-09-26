package com.filternet.app

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import com.filternet.app.databinding.DialogScanningBinding
import com.filternet.app.model.Server
import com.filternet.app.model.ServerRepository
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import java.util.Random

/**
 * ScanningBottomSheet
 * ────────────────────
 * باتم‌شیت انیمیشن اسکن سرورها:
 * 1. همه سرورها را یکی‌یکی "ping" می‌زند (شبیه‌سازی)
 * 2. نوار پیشرفت آپدیت می‌شود
 * 3. بعد از اتمام، بهترین سرور (کمترین پینگ) را برمی‌گرداند
 * 4. Sheet خودش بسته می‌شود
 */
class ScanningBottomSheet : BottomSheetDialogFragment() {

    companion object {
        const val TAG = "ScanningBottomSheet"

        fun newInstance(onDone: (Server) -> Unit): ScanningBottomSheet {
            val sheet = ScanningBottomSheet()
            sheet.onDone = onDone
            return sheet
        }
    }

    private var _binding: DialogScanningBinding? = null
    private val binding get() = _binding!!
    private var onDone: ((Server) -> Unit)? = null

    private val handler = Handler(Looper.getMainLooper())
    private val random = Random()
    private val servers = ServerRepository.all.toMutableList()
    private val scannedServers = mutableListOf<ScanItem>()
    private lateinit var scanAdapter: ScanItemAdapter
    private var currentStep = 0

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogScanningBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // غیر قابل cancel با swipe
        isCancelable = false

        scanAdapter = ScanItemAdapter(scannedServers)
        binding.rvScanServers.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = scanAdapter
        }

        binding.progressScan.max = servers.size
        startScan()
    }

    // ════════════════════════════════════════════════════════════════════
    // اسکن مرحله به مرحله
    // ════════════════════════════════════════════════════════════════════
    private fun startScan() {
        scanStep()
    }

    private fun scanStep() {
        if (currentStep >= servers.size) {
            onScanDone()
            return
        }

        val server = servers[currentStep]

        // نمایش «در حال بررسی X...»
        binding.tvScanTitle.text = getString(R.string.scanning_title)
        binding.tvScanSubtitle.text = getString(R.string.scanning_server, server.country)

        // تأخیر تصادفی برای واقعی‌تر شدن
        val delay = 180L + random.nextInt(220)
        handler.postDelayed({
            if (_binding == null) return@postDelayed

            // اضافه کردن به لیست اسکن‌شده‌ها
            scannedServers.add(
                ScanItem(server = server, status = ScanStatus.DONE)
            )
            scanAdapter.notifyItemInserted(scannedServers.lastIndex)
            binding.rvScanServers.scrollToPosition(scannedServers.lastIndex)

            // آپدیت progress
            currentStep++
            val progress = currentStep
            binding.progressScan.progress = progress
            binding.tvScanPercent.text = "${(progress * 100) / servers.size}%"
            binding.tvScanCount.text = getString(
                R.string.scanning_progress,
                progress, servers.size
            )

            // مرحله بعدی
            scanStep()
        }, delay)
    }

    private fun onScanDone() {
        val best = servers.minByOrNull { it.ping }!!
        binding.tvScanTitle.text = getString(R.string.scanning_done)
        binding.tvScanSubtitle.text = "${best.country} — ${best.city} · ${best.ping} ms"

        handler.postDelayed({
            dismiss()
            onDone?.invoke(best)
        }, 700)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        handler.removeCallbacksAndMessages(null)
        _binding = null
    }
}

// ════════════════════════════════════════════════════════════════════
// مدل و Adapter ساده برای آیتم‌های اسکن
// ════════════════════════════════════════════════════════════════════

enum class ScanStatus { SCANNING, DONE }

data class ScanItem(val server: Server, val status: ScanStatus)

class ScanItemAdapter(private val items: List<ScanItem>) :
    androidx.recyclerview.widget.RecyclerView.Adapter<ScanItemAdapter.VH>() {

    inner class VH(view: View) : androidx.recyclerview.widget.RecyclerView.ViewHolder(view) {
        val tvName: android.widget.TextView = view.findViewById(R.id.tv_scan_item_name)
        val tvPing: android.widget.TextView = view.findViewById(R.id.tv_scan_item_ping)
        val icDone: android.widget.ImageView = view.findViewById(R.id.ic_scan_item_done)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_scan_server, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        val item = items[position]
        holder.tvName.text = "${item.server.country} — ${item.server.city}"
        holder.tvPing.text = "${item.server.ping} ms"
        holder.icDone.visibility = if (item.status == ScanStatus.DONE) View.VISIBLE else View.INVISIBLE
    }

    override fun getItemCount() = items.size
}
