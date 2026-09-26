package com.filternet.app

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.widget.addTextChangedListener
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.filternet.app.databinding.FragmentServersBinding
import com.filternet.app.model.Server
import com.filternet.app.model.ServerRepository

/**
 * ServersFragment
 * ────────────────
 * لیست کامل سرورها با جستجو و اتصال هوشمند.
 */
class ServersFragment : Fragment() {

    private var _binding: FragmentServersBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: ServerAdapter
    private var selectedId = ServerRepository.getBest().id

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentServersBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecycler()
        setupSearch()
        setupSmartConnect()
    }

    private fun setupRecycler() {
        adapter = ServerAdapter { server -> selectServer(server) }
        binding.rvServers.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@ServersFragment.adapter
        }
        adapter.submitList(ServerRepository.all)
        adapter.setSelected(selectedId)
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener { editable ->
            val q = editable?.toString()?.trim() ?: ""
            val filtered = if (q.isEmpty()) ServerRepository.all
            else ServerRepository.all.filter {
                it.country.contains(q) || it.city.contains(q) ||
                it.code.contains(q, ignoreCase = true)
            }
            adapter.submitList(filtered)
        }
    }

    private fun setupSmartConnect() {
        binding.btnSmartConnect.setOnClickListener {
            val best = ServerRepository.getBest()
            selectServer(best)
        }
    }

    private fun selectServer(server: Server) {
        selectedId = server.id
        adapter.setSelected(server.id)
        // برگشت به Home و انتقال سرور انتخاب‌شده
        findNavController().previousBackStackEntry
            ?.savedStateHandle
            ?.set("selected_server_id", server.id)
        findNavController().popBackStack()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
